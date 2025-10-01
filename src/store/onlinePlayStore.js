import { create } from "zustand";
import { getSocket } from "../services/socketService.js";
import { toast } from 'react-toastify';

// import { setPlayerState } from "./gameSlice.js";

// Import audio files
import bgMusic from "/music/background-music.mp3";
import winMusic from "/music/win-music.mp3";
import loseMusic from "/music/lose-music.mp3";
import drawMusic from "/music/draw-music.mp3";
import cellClickSound from "/music/cell-click-sound.mp3";
import Click from "/music/click.mp3";
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
        cellclickSound: new Audio(cellClickSound),
        click: new Audio(Click),
        wrongClickSound: new Audio(wrongClickSound),
        restartSound: new Audio(restartSound),
        strikeSound: new Audio(strikeSound),
    };

    // set volumes
    audios.winMusic.volume = 0.5;
    audios.loseMusic.volume = 0.5;
    audios.drawMusic.volume = 0.5;
    audios.cellclickSound.volume = 0.8;
    audios.click.volume = 0.8;
    audios.wrongClickSound.volume = 0.8;
    audios.restartSound.volume = 0.5;
    audios.strikeSound.volume = 0.7;

    return {
        // 🔹 state for online play (you can add more here later)
        roomId: '',
        socket: getSocket(),
        socketId: null,
        opponentSymbol: null,
        opponentUser: {
            username: "AI",
            email: "ankit2005bhagat@gmail.com",
            profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKcsVMR5kXAqIxXZyDvqymKfKOKFPhBjr3u9caGp1HmqtuGvQ=s96-c",
        },
        playersInfo: [],
        isPlaying: false,
        musicOn: false,
        currentPlayer: null,
        playerSymbol: null,
        status: "",
        winLineStyle: {},
        showWinLine: false,
        boardLocked: false,
        winCells: [],

        customWin: 3,
        customSize: 3,
        player: '',
        playerState: '',
        mode: '',
        startPlay: false,
        boardState: Array(9).fill(null),

        round: 1,
        score: 0,
        gameOver: false,
        timer: 120,
        intervalId: null,
        numPlayers: 3,
        selectedIcon: { id: "X", icon: "AutoColorX" },
        selectedColor: { id: "red", bg: "bg-red-500", border: "border-red-400" },
        privateCode: "",
        voiceChat: false,
        entryAmount: 100,
        currentIndex: 0,
        totalCoins: 3450,
        diamonds: 150,
        dailyFree: 3,
        step: 0,
        selectedGame: "Classic",
        showSetting: true,
        // setters
        setMusicOn: (value) => set((state) => ({ musicOn: typeof value === 'function' ? value(state.musicOn) : value })),
        setShowSetting: (value) => set({ showSetting: value }),
        setNumPlayers: (num) => set({ numPlayers: num }),
        setSelectedIcon: (icon) => set({ selectedIcon: icon }),
        setSelectedColor: (color) => set({ selectedColor: color }),
        setPrivateCode: (code) => set({ privateCode: code }),
        setVoiceChat: (enabled) => set({ voiceChat: enabled }),
        setEntryAmount: (amount) => set({ entryAmount: amount }),
        setCurrentIndex: (index) => set({ currentIndex: index }),
        setStep: (step) => set({ step }),
        setSelectedGame: (game) => set({ selectedGame: game }),
        addCoins: (amount) => set((state) => ({ totalCoins: state.totalCoins + amount })),
        spendCoins: (amount) => set((state) => ({ totalCoins: state.totalCoins - amount })),
        addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),
        spendDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds - amount })),

        // 🔹 audio state + functions
        audios,

        play: (name) => {
            if (!get().isPlaying) return;
            const audio = get().audios[name];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch((error) => {
                    console.error(`Error playing ${name}:`, error);
                });
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
        setTimer: (value) => set({ timer: value }),
        setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
        setIsGameOver: (value) => set({ gameOver: value }),
        setPlayerSymbol: (symbol) => set({ playerSymbol: symbol }),
        setRoomId: (roomId) => set({ roomId: roomId }),
        setCurrentPlayer: (currentPlayer) => set({ currentPlayer: currentPlayer }),
        setStatus: (status) => set({ status }),
        setWinLineStyle: (style) => set({ winLineStyle: style }),
        setShowWinLine: (value) => set({ showWinLine: value }),
        setBoardLocked: (value) => set({ boardLocked: value }),
        setBoardState: (board) => set({ boardState: board }),
        setWinCells: (cells) => set({ winCells: cells }),

        setPlayer: (player) => set({ player: player }),
        setStartPlay: (value) => set({ startPlay: value }),
        setMode: (mode) => set({ mode: mode }),
        setPlayerState: (state) => set({ playerState: state }),
        setCustomWin: (win) => set({ customWin: win }),
        setCustomSize: (size) => set({ customSize: size }),
        setSocketId: (id) => set({ socketId: id }),
        setOpponentSymbol: (symbol) => set({ opponentSymbol: symbol }),
        setOpponentUser: (user) => set({ opponentUser: user }),
        setPlayersInfo: (info) => set({ playersInfo: info }),
        addRound: (round) => set((state) => ({ round: state.round + round })),
        addScore: (score) => set((state) => ({ score: state.score + score })),
        startTimer: () => {
            const { startPlay, intervalId } = get();
            if (!startPlay || intervalId) return; // already running

            const id = setInterval(() => {
                set((state) => {
                    const newTimer = state.timer - 1;
                    if (newTimer <= 0) {
                        get().handleGameOver();
                        clearInterval(id);
                        return { timer: 0, intervalId: null };
                    }
                    return { timer: newTimer };
                });
            }, 1000);

            set({ intervalId: id });
        },

        stopTimer: () => {
            const { intervalId } = get();
            if (intervalId) {
                clearInterval(intervalId);
                set({ intervalId: null });
            }
        },

        resetTimer: (time = 60 * 3) => {
            const { stopTimer } = get();
            stopTimer();
            set({ timer: time, intervalId: null });
        },
        // Socket Event Listeners
        initsocketListeners: () => {
            const { stop, socket, loop , setPlayerSymbol, setBoardState, setStatus, handleRoundOver, handleGameOver, resetWinLine, setRoomId, setCurrentPlayer } = get();
            if (!socket) return;

            // removing existing listeners to prevent duplicate handlers
            socket.off("connect");
            socket.off("updateBoard");
            socket.off("playerAssignment");
            socket.off("noRoom");
            socket.off("roomFull");
            socket.off("forceRefresh");
            socket.off("roomCreated");
            socket.off("gameOver");
            socket.off("overallGameOver");
            socket.off("startGame");
            socket.off("gameMode");
            socket.off("playersInfo");

            // Socket event listeners

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
                handleRoundOver(msg, winner, winningCells);
            });
            socket.on("overallGameOver", () => {
                handleGameOver();
            });
            socket.on("startGame", (msg) => {
                setStatus(msg);
                get().resetTimer();
                get().startTimer();
                resetWinLine();
            });

            socket.on("connect", () => {
                get().setSocketId(socket.id);
            });

            socket.on("gameMode", (mode, customSize) => {
                get().setMode(mode);
                get().setCustomSize(customSize);
                console.log("CustomSize Received", customSize);
            });

            socket.on("playersInfo", (playersInfo) => {
                get().setPlayersInfo(playersInfo);
                const myId = get().socketId;
                const opponent = playersInfo.find(p => p.id !== myId);
                if (opponent) get().setOpponentSymbol(opponent.symbol);
                if (opponent) {
                    get().setOpponentUser(opponent.user);
                }
                console.log(opponent, playersInfo, myId)
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
                    get().loop("strikeSound", false);
                    get().play("strikeSound");

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
        // 🔹 overall game over handler (when timer reaches 0)
        handleGameOver: () => {
            const { score, round, setIsGameOver, setStatus, setBoardLocked, refs, stopTimer } = get();

            // stop timer
            stopTimer();

            // stop background music
            get().loop("bgMusic", false);
            get().stop("bgMusic");

            // calculate winner based on score and round
            const opponentScore = round - score;
            let msg = "";

            if (score > opponentScore) {
                msg = "You won the overall game!";
                get().play("winMusic");
                toast.success(msg);
            } else if (score < opponentScore) {
                msg = "You lost the overall game!";
                get().play("loseMusic");
                toast.error(msg);
            } else {
                msg = "Overall game is a draw!";
                get().play("drawMusic");
                toast.info(msg);
            }

            // set game over
            setIsGameOver(true);
            setBoardLocked(true);
            setStatus(msg);

            // overlay message
            if (refs.overlay) {
                refs.totalGameWon.innerText = msg + `You have won ${score} Game out of ${round}`;
            }

            // emit to server if needed
            // get().socket.emit("overallGameOver", { score, round });
        },
        // 🔹 round over handler
        handleRoundOver: (msg, winner, winningCells) => {
            const { playerSymbol, score, round, addRound, setStatus, setShowWinLine, setBoardLocked, drawWinLine, refs, } = get();

            // stop background
            get().loop("bgMusic", false);
            get().stop("bgMusic");
            addRound(1)
            console.log("Player is:", playerSymbol, "The winner is", winner);

            // play result sounds
            if (winner === null) {
                get().play("drawMusic");
                toast.info("It is a Draw");
            } else if (playerSymbol === winner) {
                get().play("winMusic");
                get().addCoins(900);
                get().addScore(1);
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
                refs.totalGameWon.innerText = msg + `\nYou won ${score} round out of ${round}`;
                refs.totalGameWon.style.whiteSpace = "pre-line";
            }

            // update state
            setStatus(msg);
            setShowWinLine(true);
            setBoardLocked(true); // 🔒 stop further moves
        },
        newGame: () => {
            const { resetWinLine, setBoardState, socket, setShowWinLine, roomId, customSize, round } = get();
            resetWinLine();
            (round > 1) ? toast.info(`Next Round Started${roomId ? ` with ${roomId}` : ''}`) : toast.info(`Next Game Started${roomId ? ` with ${roomId}` : ''}`)
            setBoardState(Array(customSize * customSize).fill(null));
            socket.emit("newGame", roomId);
            setShowWinLine(false);
        },
        aiMove: (index) => {
            const { setStatus, currentPlayer, customSize, customWin, playerSymbol, setWinCells, setPlayerSymbol, boardState, setBoardState, checkWinner, handleRoundOver, setCurrentPlayer, checkDraw } = get();

            // assume human is always "X" unless you store playerSymbol differently
            const humanSymbol = playerSymbol || "X";
            const aiSymbol = humanSymbol === "X" ? "O" : "X";
            setPlayerSymbol(humanSymbol)

            // place human symbol
            const newBoard = [...boardState];
            if (newBoard[index] !== null) {
                toast.error("This cell is already filled!");
                get().play("wrongClickSound");
                return;
            }
            newBoard[index] = humanSymbol;
            setBoardState(newBoard);
            get().play("cellclickSound");

            // check win/draw
            const result = checkWinner(newBoard, customSize, customSize, customWin);
            if (result?.winner) {
                setWinCells(result.cells);
                handleRoundOver(`Player ${result.winner} wins!`, result.winner, result.cells);
                return;
            }
            if (checkDraw(newBoard)) {
                handleRoundOver(`It's a draw!`, null, []);
                return;
            }
            (playerSymbol === currentPlayer && currentPlayer) && setStatus(`It's Player ${currentPlayer}'s turn!`);

            // AI move (simple random for now)
            setTimeout(() => {
                const empty = newBoard.reduce((acc, v, i) => { if (!v) acc.push(i); return acc; }, []);
                if (empty.length === 0) return;
                const choice = empty[Math.floor(Math.random() * empty.length)];
                const afterAI = [...newBoard];
                afterAI[choice] = aiSymbol;
                setBoardState(afterAI);
                get().play("cellclickSound");

                const winner2 = checkWinner(afterAI, customSize, customSize, customWin);
                if (winner2?.winner) {
                    setWinCells(winner2.cells);
                    handleRoundOver(`Player ${winner2.winner} wins!`, winner2.winner, winner2.cells);
                    return;
                }
                if (checkDraw(afterAI)) {
                    handleRoundOver(`It's a draw!`, null, []);
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
            const { boardLocked, refs, socket, setShowWinLine, roomId, playerSymbol } = get();
            const { generateWinningPatterns, customSize, customWin } = get();
            const winConditions = generateWinningPatterns(customSize, customSize, customWin);
            if (boardLocked) return; // 🚫 prevent moves if locked

            const index = [...refs.board.children].indexOf(e.target);
            if (index !== -1) {
                socket.emit("makeMove", { roomId, index, player: playerSymbol, winConditions });
            }
            setShowWinLine(false);
        },
        createRoom: (selectedMode, user) => {
            const { socket, customSize, setPlayerState, mode } = get();
            if (selectedMode === "online") {
                setPlayerState("online");
                socket.emit("createRoom", customSize, mode, user);
            }
        },
        joinRoom: (id, user) => {
            const { setShowWinLine, setRoomId, socket, setPlayerState } = get();
            if (!socket) {
                console.error("Socket not connected yet");
                return;
            }
            setPlayerState("online");
            const trimmedId = id.trim();
            console.log("Joining room with id:", trimmedId);
            setRoomId(trimmedId);
            socket.emit("joinGame", trimmedId, user);
            setShowWinLine(false);
        },
        cleanup: () => {
            set({
                roomId: '',
                socketId: null,
                opponentSymbol: null,
                opponentUser: { username: '', profilePicture: '' },
                playersInfo: [],
                isPlaying: false,
                currentPlayer: null,
                playerSymbol: null,
                status: "",
                winLineStyle: {},
                showWinLine: false,
                boardLocked: false,
                winCells: [],

                customWin: 3,
                customSize: 3,
                player: '',
                playerState: '',
                mode: '',
                startPlay: false,
                boardState: Array(9).fill(null),

                round: 1,
                score: 0,
                gameOver: false,
                timer: 60,
                intervalId: null,
                numPlayers: 3,
                selectedIcon: { id: "X", icon: "AutoColorX" },
                selectedColor: { id: "red", bg: "bg-red-500", border: "border-red-400" },
                privateCode: "",
                voiceChat: false,
                entryAmount: 100,
                currentIndex: 0,
                totalCoins: 3450,
                diamonds: 150,
                dailyFree: 3,
                step: 0,
                selectedGame: "Classic",
            })
        },
    };
});

export default useOnlinePlayStore;