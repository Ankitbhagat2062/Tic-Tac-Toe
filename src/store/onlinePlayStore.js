import { create } from "zustand";
import { getSocket } from "../services/socketService.js";
import { toast } from 'react-toastify';

import { setPlayerState } from "./gameSlice.js";

// Import audio files
import bgMusic from "/music/background-music.mp3";
import winMusic from "/music/win-music.mp3";
import loseMusic from "/music/lose-music.mp3";
import drawMusic from "/music/draw-music.mp3";
import clickSound from "/music/click-sound.mp3";
import wrongClickSound from "/music/wrong-click-sound.mp3";
import restartSound from "/music/restart-sound.mp3";
import strikeSound from "/music/strike.mp3";

const useOnlinePlayStore = create((set, get) => {
    // ✅ initialize audios once
    const audios = {
        bgMusic: new Audio(bgMusic),
        winMusic: new Audio(winMusic),
        loseMusic: new Audio(loseMusic),
        drawMusic: new Audio(drawMusic),
        clickSound: new Audio(clickSound),
        wrongClickSound: new Audio(wrongClickSound),
        restartSound: new Audio(restartSound),
        strikeSound: new Audio(strikeSound),
    };

    // set volumes
    audios.winMusic.volume = 0.5;
    audios.loseMusic.volume = 0.5;
    audios.drawMusic.volume = 0.5;
    audios.clickSound.volume = 0.8;
    audios.wrongClickSound.volume = 0.8;
    audios.restartSound.volume = 0.5;
    audios.strikeSound.volume = 0.7;

    return {
        // 🔹 state for online play (you can add more here later)
        roomId: '',
        socket: getSocket(),
        isPlaying: false,
        currentPlayer: null,
        playerSymbol: null,
        status: "",
        winLineStyle: {},
        showWinLine: false,
        boardLocked: false,
        winCells: [],
        winConditions: [],
        
        customWin: 3,
        customSize: 3,
        player: '',
        playerState: '',
        mode: '',
        startPlay: false,
        boardState: Array(9).fill(null),

        // 🔹 audio state + functions
        audios,

        play: (name) => {
            const audio = get().audios[name];
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        },
        stop: (name) => {
            const audio = get().audios[name];
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        },
        stopAll: () => {
            const { audios } = get();
            Object.keys(audios).forEach(name => {
                const audio = audios[name];
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        },
        loop: (name, shouldLoop) => {
            const audio = get().audios[name];
            if (audio) {
                audio.loop = shouldLoop;
            }
        },
        refs: {
            overlay: null,
            totalGameWon: null,
            board: null,
            line: null,
            msg: null,
            playerSymbol: null,
        },
        setRef: (name, ref) =>
            set((state) => ({
                refs: { ...state.refs, [name]: ref },
            })),

        setPlayerSymbol: (symbol) => set({ playerSymbol: symbol }),
        setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
        setRoomId: (roomId) => set({ roomId: roomId }),
        setCurrentPlayer: (currentPlayer) => set({ currentPlayer: currentPlayer }),
        setStatus: (status) => set({ status }),
        setWinLineStyle: (style) => set({ winLineStyle: style }),
        setShowWinLine: (value) => set({ showWinLine: value }),
        setBoardLocked: (value) => set({ boardLocked: value }),
        setBoardState: (board) => set({ boardState: board }),
        setWinCells: (cells) => set({ winCells: cells }),
        setWinConditions: (cells) => set({ winConditions: cells }),

        setPlayer: (player) => set({ player: player }),
        setStartPlay: (value) => set({ startPlay: value }),
        setMode: (mode) => set({ mode: mode }),
        setPlayerState: (state) => set({ playerState: state }),
        setCustomWin: (win) => set({ customWin: win }),
        setCustomSize: (size) => set({ customSize: size }),

        // Socket Event Listeners
        initsocketListeners: () => {
            const { stop, socket, loop, play, refs, setPlayerSymbol, setBoardState, setStatus, handleGameOver, resetWinLine, setRoomId, setCurrentPlayer } = get();
            if (!socket) return;

            // removing existing listeners to prevent duplicate handlers
            socket.off("connect");
            socket.off("welcome");
            socket.off("updateBoard");
            socket.off("playerAssignment");
            socket.off("noRoom");
            socket.off("roomFull");
            socket.off("forceRefresh");
            socket.off("roomCreated");
            socket.off("gameOver");
            socket.off("startGame");

            // Socket event listeners
            socket.on("connect", () => {
                loop("bgMusic", false);  // set background music to loop
                stop("bgMusic");        // start playing 🎶
            });

            socket.on("welcome", (msg) => {
                if (refs.msg) {
                    refs.msg.innerText = msg;
                    console.log("Server says:", msg);
                }
            });

            socket.on("updateBoard", (board, currentPlayer) => {
                setBoardState(board);
                setCurrentPlayer(currentPlayer);
                setStatus(`Player ${currentPlayer}'s turn`);
            });

            socket.on("playerAssignment", (symbol) => {
                setPlayerSymbol(symbol);
                setStatus(`You are Player ${symbol}`);
            });

            socket.on("noRoom", (msg) => {
                setStatus(msg);
            });

            socket.on("roomFull", () => {
                setStatus("Room is full!");
            });

            socket.on("forceRefresh", () => {
                loop("bgMusic", false);  // set background music to loop
                stop("bgMusic");
                window.location.reload();
            });

            socket.on("roomCreated", (roomId) => {
                setRoomId(roomId);
                console.log("RoomId created ", roomId);
            });
            socket.on("gameOver", (msg, winner, winningCells) => {
                handleGameOver(msg, winner, winningCells);
            });


            socket.on("startGame", (msg) => {
                setStatus(msg);
                resetWinLine();
                loop("bgMusic", true);  // set background music to loop
                play("bgMusic");
            });
        },
        resetWinLine: () => {
            // step 1: reset opacity + transition
            set({
                winLineStyle: {
                    opacity: "0",
                    transition: "width 0.5s ease",
                },
            });

            // step 2: after timeout, reset width & hide line
            setTimeout(() => {
                set({
                    winLineStyle: { width: "0px", opacity: "1" },
                    showWinLine: false,
                });
            }, 300);

            // step 3: unlock board
            set({ boardLocked: false });
        },
        // 🔹 main game over handler
        handleGameOver: (msg, winner, winningCells) => {
            const { playerSymbol, setStatus, setShowWinLine, setBoardLocked, drawWinLine, refs, } = get();

            // stop background
            get().stop("bgMusic");
            get().loop("bgMusic", false);

            console.log("Player is:", playerSymbol, "The winner is", winner);

            // play result sounds
            if (winner === null) {
                get().play("drawMusic");
                toast.info("It is a Draw");
            } else if (playerSymbol === winner) {
                get().play("winMusic");
                toast.success("You have won");
            } else if (playerSymbol !== winner && winner) {
                get().play("loseMusic");
                toast.error("You have lost");
            }

            // highlight winning cells
            if (winningCells && winningCells.length) {
                drawWinLine(winningCells);
            }

            // overlay message
            if (refs.overlay) {
                refs.totalGameWon.innerText = msg + `\nYou won 1 round`;
                refs.totalGameWon.style.whiteSpace = "pre-line";
            }

            // update state
            setStatus(msg);
            setShowWinLine(true);
            setBoardLocked(true); // 🔒 stop further moves
        },
        // --- draw win line
        drawWinLine: (cells) => {
            const { refs } = get();
            set({ showWinLine: true, winCells: cells });

            if (refs.board && refs.line) {
                const cellEls = Array.from(refs.board.children);
                const startCell = cellEls[cells[0]].getBoundingClientRect();
                const endCell = cellEls[cells[2]].getBoundingClientRect();
                const boardRect = refs.board.getBoundingClientRect();

                const x1 = startCell.left + startCell.width / 2 - boardRect.left;
                const y1 = startCell.top + startCell.height / 2 - boardRect.top;
                const x2 = endCell.left + endCell.width / 2 - boardRect.left;
                const y2 = endCell.top + endCell.height / 2 - boardRect.top;

                const length = Math.hypot(x2 - x1, y2 - y1);
                const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

                // initial line style (hidden)
                set({
                    winLineStyle: {
                        width: "0px",
                        height: "4px",
                        backgroundColor: "red",
                        position: "absolute",
                        top: `${y1}px`,
                        left: `${x1}px`,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "0 50%",
                    },
                });

                // animate after 50ms
                setTimeout(() => {
                    const strike = get().audios.strikeSound;
                    strike.loop = false;
                    strike.currentTime = 0;
                    strike.play();

                    set({
                        winLineStyle: {
                            transition: "width 0.5s ease",
                            width: length + 40 + "px",
                            height: "4px",
                            backgroundColor: "red",
                            position: "absolute",
                            top: `${y1 + 15}px`,
                            left: `${x1}px`,
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: "0 50%",
                        },
                    });
                }, 50);
            }
        },
        createRoom: (selectedMode) => {
            const { socket , customSize } = get();
            if (selectedMode === "online") {
                get().play("bgMusic");
                setPlayerState("online");
                socket.emit("createRoom", customSize);
            }
        },
        joinRoom: (id) => {
            const { setShowWinLine, setRoomId, socket } = get();
            if (!socket) {
                console.error("Socket not connected yet");
                return;
            }
            setPlayerState("online");
            const trimmedId = id.trim();
            console.log("Joining room with id:", trimmedId);
            setRoomId(trimmedId);
            socket.emit("joinGame", trimmedId);
            get().play("bgMusic");
            setShowWinLine(false);
        },
        newGame: () => {
            const { resetWinLine, setBoardState, socket, setShowWinLine, roomId, stopAll , customSize } = get();
            resetWinLine();
            toast.info(`New Game Started${roomId ? ` with ${roomId}` : ''}`);
            stopAll(); // Stop all music to clear everything
            setBoardState(Array(customSize * customSize).fill(null));
            socket.emit("newGame", roomId);
            setShowWinLine(false);
        },
        aiMove: (index) => {
            const {customSize , customWin,  playerSymbol, setWinCells, setPlayerSymbol, boardState, setBoardState, checkWinner, handleGameOver, setCurrentPlayer, checkDraw } = get();

            // assume human is always "X" unless you store playerSymbol differently
            const humanSymbol = playerSymbol || "X";
            const aiSymbol = humanSymbol === "X" ? "O" : "X";
            setPlayerSymbol(humanSymbol)

            // place human symbol
            const newBoard = [...boardState];
            newBoard[index] = humanSymbol;
            setBoardState(newBoard);
            get().play("clickSound");

            // check win/draw
            const result = checkWinner(newBoard, customSize, customSize, customWin);
            if (result?.winner) {
                setWinCells(result.cells);
                handleGameOver(`Player ${result.winner} wins!`, result.winner, result.cells);
                return;
            }
            if (checkDraw(newBoard)) {
                handleGameOver(`It's a draw!`, null, []);
                return;
            }

            // AI move (simple random for now)
            setTimeout(() => {
                const empty = newBoard.reduce((acc, v, i) => { if (!v) acc.push(i); return acc; }, []);
                if (empty.length === 0) return;
                const choice = empty[Math.floor(Math.random() * empty.length)];
                const afterAI = [...newBoard];
                afterAI[choice] = aiSymbol;
                setBoardState(afterAI);
                get().play("clickSound");

                const winner2 = checkWinner(afterAI, customSize, customSize, customWin);
                if (winner2?.winner) {
                    setWinCells(winner2.cells);
                    handleGameOver(`Player ${winner2.winner} wins!`, winner2.winner, winner2.cells);
                    return;
                }
                if (checkDraw(afterAI)) {
                    handleGameOver(`It's a draw!`, null, []);
                    return;
                }

                // AI done, human turn again (if you maintain currentPlayer)
                setCurrentPlayer(humanSymbol);
            }, 500);

            return;
        },
        generateWinningPatterns: (rows, cols, winLength) => {
            const patterns = [];

            // directions: right, down, down-right, down-left
            const directions = [
                [0, 1],   // horizontal
                [1, 0],   // vertical
                [1, 1],   // diagonal ↘
                [1, -1],  // diagonal ↙
            ];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    for (let [dr, dc] of directions) {
                        const cells = [];
                        for (let k = 0; k < winLength; k++) {
                            const nr = r + dr * k;
                            const nc = c + dc * k;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                                cells.push(nr * cols + nc);
                            }
                        }
                        if (cells.length === winLength) {
                            patterns.push(cells);
                        }
                    }
                }
            }

            return patterns;
        },
        checkWinner: (board, rows, cols, winLength) => {
            const { generateWinningPatterns } = get();
            const winConditions = generateWinningPatterns(rows, cols, winLength);
            for (let condition of winConditions) {
                const values = condition.map(i => board[i]);
                if (values.every(v => v && v === values[0])) {
                    return { winner: values[0], cells: condition }; // ✅ winner + winning cells
                }
            }

            return null;
        },
        checkDraw: (board) => board.every(cell => cell !== null),
        boardElClick: (e) => {
            const { boardLocked, refs, socket, setShowWinLine, roomId, playerSymbol, winConditions } = get();
            if (boardLocked) return; // 🚫 prevent moves if locked

            const index = [...refs.board.children].indexOf(e.target);
            if (index !== -1) {
                socket.emit("makeMove", { roomId, index, player: playerSymbol, winConditions });
            }
            setShowWinLine(false);
        },
        cleanup: () => {
            const { customSize } = get();
            set({
                roomId: null,
                isPlaying: false,
                currentPlayer: null,
                playerSymbol: null,
                status: "",
                winLineStyle: {},
                showWinLine: false,
                boardLocked: false,
                boardState: Array(customSize * customSize).fill(null),
                winCells: [],
            })
        },
    };
});

export default useOnlinePlayStore;