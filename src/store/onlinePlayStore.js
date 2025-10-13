import { create } from "zustand";
import { getSocket } from "../services/socketService.js";
import { toast } from 'react-toastify';

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
import { OIcon, XIcon } from "../Assets/react-icons.jsx";
import useAuthStore from "./useAuthStore.js";

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
        },
        setRef: (name, ref) =>
            set((state) => ({
                refs: { ...state.refs, [name]: ref },
            })),

        // 🔹 state for online play (you can add more here later)
        roomId: '',
        socket: getSocket(),
        socketId: null,
        opponentUser: {},
        playersInfo: [],
        isPlaying: false,
        musicOn: false,
        currentPlayer: null,
        status: "",
        winLineStyle: {},
        showWinLine: false,
        boardLocked: false,
        winCells: [],

        customWin: 3,
        customSize: 3,
        player: {},
        playerState: '',
        mode: 'Classic',
        startPlay: false,
        boardState: Array(9).fill(null),

        round: 0,
        score: 0,
        gameOver: false,
        timer: 120,
        intervalId: null,
        selectedIcon: { id: "X", icon: XIcon },
        opponentIcon: { id: "0", icon: OIcon },
        selectedColor: { id: "red", bg: "bg-red-500", border: "border-red-400" },
        voiceChat: false,
        entryAmount: 100,
        currentIndex: 0,
        totalCoins: 3450,
        diamonds: 150,
        dailyFree: 3,
        step: 0,
        selectedGame: "Classic",
        showSetting: true,
        error: null,
        isPlayingWith: '',
        onlineUsers: [],
        nextOpponent: null,
        isCreator: false,
        selectedPlayers: 2,
        // setters
        setSelectedPlayers: (num) => set({ selectedPlayers: num }),
        setError: (error) => set({ error: error }),
        setIsCreator: (value) => set({ isCreator: value }),
        setNextOpponent: (opponent) => set({ nextOpponent: opponent }),
        setIsPlayingWith: (isPlayingWith) => set({ isPlayingWith: isPlayingWith }),
        setMusicOn: (value) => set((state) => ({ musicOn: typeof value === 'function' ? value(state.musicOn) : value })),
        setShowSetting: (value) => set({ showSetting: value }),
        setSelectedIcon: (icon) => set({ selectedIcon: icon }),
        setOpponentIcon: (icon) => set({ opponentIcon: icon }),
        setSelectedColor: (color) => set({ selectedColor: color }),
        setVoiceChat: (enabled) => set({ voiceChat: enabled }),
        setEntryAmount: (amount) => set({ entryAmount: amount }),
        setCurrentIndex: (index) => set((state) => ({ currentIndex: typeof index === 'function' ? index(state.currentIndex) : index })),
        setStep: (step) => set({ step }),
        setSelectedGame: (game) => set({ selectedGame: game }),
        addCoins: (amount) => set((state) => ({ totalCoins: state.totalCoins + amount })),
        spendCoins: (amount) => set((state) => ({ totalCoins: state.totalCoins - amount })),
        addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),
        spendDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds - amount })),

        setTimer: (value) => set({ timer: value }),
        setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
        setIsGameOver: (value) => set({ gameOver: value }),
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
        setOpponentUser: (user) => set({ opponentUser: user }),
        setPlayersInfo: (info) => set({ playersInfo: info }),
        addRound: (round) => set((state) => ({ round: state.round + round })),
        addScore: (score) => set((state) => ({ score: state.score + score })),
        setOnlineUsers: (users) => set({ onlineUsers: users }),
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
            const { stop, socket, loop, setBoardState, setStatus, handleRoundOver, handleGameOver, resetWinLine, setRoomId, setCurrentPlayer } = get();
            if (!socket) {
                get().setError("No Socket Received");
                return
            }

            // removing existing listeners to prevent duplicate handlers
            socket.off("onlineUsers");
            socket.off("connect");
            socket.off("updateBoard");
            socket.off("noRoom");
            socket.off("roomFull");
            socket.off("forceRefresh");
            socket.off("gameOver");
            socket.off("overallGameOver");
            socket.off("startGame");
            socket.off("playersInfo");
            socket.off("roomCreated");
            socket.off("roomIdReceived");

            // Socket event listeners

            socket.on("onlineUsers", (users) => {
                const user = useAuthStore.getState().user;
                const filteredUsers = users.filter(u => u.userId !== user.userId);
                get().setOnlineUsers(filteredUsers);
            })

            socket.on("updateBoard", (board, currentPlayer) => {
                setBoardState(board);
                setCurrentPlayer(currentPlayer);
                setStatus(`Player ${currentPlayer}'s turn`);
            });

            socket.on("noRoom", (msg) => {
                setStatus(msg);
                get().setError(msg);
            });

            socket.on("roomFull", () => {
                setStatus("Room is full!");
                get().setError('Room is full!')
            });

            socket.on("forceRefresh", () => {
                loop("bgMusic", false);  // set background music to loop
                stop("bgMusic");
                window.location.reload();
                get().setError("User disconnect or refreshed the Page")
            });

            socket.on("roomCreated", (newRoomId) => {
                setRoomId(newRoomId);
                // notify opponent that this user created room
                const { nextOpponent } = get();
                if (nextOpponent) {
                    socket.emit("roomIdShared", newRoomId, nextOpponent.username);
                }
            });

            socket.on("roomIdReceived", (receivedRoomId) => {
                setRoomId(receivedRoomId);
                const { player } = get();
                socket.emit("joinGame", receivedRoomId.trim(), player);
            });

            socket.on("gameOver", (msg, winner, winningCells) => {
                handleRoundOver(msg, winner, winningCells);
            });
            socket.on("overallGameOver", () => {
                handleGameOver();
            });
            socket.on("startGame", (msg) => {
                // const user = useAuthStore.getState().user;
                setStatus(msg);
                if (get().round <= 1) {
                    get().startTimer();
                    get().setStartPlay(true);
                }
                resetWinLine();
            });

            socket.on("connect", () => {
                get().setSocketId(socket.id);
                toast("Socket Connected")
            });

            socket.on("playersInfo", (playersInfo) => {
                get().setPlayersInfo(playersInfo);
                const myId = get().socketId;
                const usersOwn = playersInfo.find(p => p.id === myId);
                const opponent = playersInfo.find(p => p.id !== myId);
                if (opponent) {
                    get().setOpponentUser(opponent.user);
                    get().setMode(opponent.mode)
                    get().setCustomSize(opponent.customSize);
                }
                if (usersOwn) {
                    setStatus(`You are Player ${usersOwn.id}`);
                }
                if (usersOwn.isCreator) get().setIsCreator(usersOwn.isCreator);
                console.log(opponent.user);
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
                msg = "You won! "; // 🏆
                get().play("winMusic");
                toast.success(msg);
            } else if (score < opponentScore) {
                msg = "You lost! ";
                get().play("loseMusic");
                toast.error(msg);
            } else {
                msg = "It's a draw! "; //  🤝
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
            const { player, score, round, addRound, setStatus, setShowWinLine, setBoardLocked, drawWinLine, refs, } = get();

            // stop background
            get().loop("bgMusic", false);
            get().stop("bgMusic");
            addRound(1);
            // play result sounds
            if (winner === null) {
                get().play("drawMusic");
                toast.info("It is a Draw");
            } else if (player?.user?.username === winner) {
                get().play("winMusic");
                get().addCoins(900);
                get().addScore(1);
                toast.success("You have won");
            } else if (player?.user?.username !== winner && winner) {
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
            const {
                setStatus,
                player,
                opponentUser,
                // currentPlayer,
                customSize,
                customWin,
                setWinCells,
                setBoardState,
                boardState,
                checkWinner,
                handleRoundOver,
                setCurrentPlayer,
                checkDraw,
                play,
            } = get();

            // Both player and AI symbols (JSX)
            const humanSymbol = player?.user?.username;
            const aiSymbol = opponentUser?.user?.username;

            const newBoard = [...boardState];
            // 🧱 Prevent overwriting filled cells
            if (newBoard[index] !== null) {
                toast.error("This cell is already filled!");
                play("wrongClickSound");
                return;
            }

            // 🎯 Player move
            newBoard[index] = humanSymbol;
            setBoardState(newBoard);
            play("cellclickSound");

            // 🏁 Check if human won
            const result = checkWinner(newBoard, customSize, customSize, customWin);
            if (result?.winner) {
                setWinCells(result.cells);
                handleRoundOver(`You win!`, result.winner, result.cells);
                return;
            }

            if (checkDraw(newBoard)) {
                handleRoundOver(`It's a draw!`, null, []);
                return;
            }

            // 🧠 Switch to AI turn
            setCurrentPlayer(opponentUser?.user?.username);
            setStatus("AI is thinking...");

            // ⏱ Simulate AI delay (0.5s)
            setTimeout(() => {
                const availableMoves = newBoard
                    .map((v, i) => (v === null ? i : null))
                    .filter((v) => v !== null);

                if (availableMoves.length === 0) return;

                const aiChoice =
                    availableMoves[Math.floor(Math.random() * availableMoves.length)];

                const afterAI = [...newBoard];
                afterAI[aiChoice] = aiSymbol;
                setBoardState(afterAI);
                play("cellclickSound");

                // ✅ Check AI win/draw
                const aiResult = checkWinner(afterAI, customSize, customSize, customWin);
                if (aiResult?.winner) {
                    setWinCells(aiResult.cells);
                    handleRoundOver(`AI wins!`, aiResult.winner, aiResult.cells);
                    return;
                }

                if (checkDraw(afterAI)) {
                    handleRoundOver(`It's a draw!`, null, []);
                    return;
                }

                // 🔁 Switch back to human turn
                setCurrentPlayer(player?.user?.username);
                setStatus("Your turn!");
            }, 500);
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
            const { boardLocked, refs, socket, setShowWinLine, roomId, player } = get();
            const { generateWinningPatterns, customSize, customWin } = get();
            const winConditions = generateWinningPatterns(customSize, customSize, customWin);
            if (boardLocked) return; // 🚫 prevent moves if locked

            const index = [...refs.board.children].indexOf(e.target);
            if (index !== -1) {
                socket.emit("makeMove", { roomId, index, player: player, winConditions });
            }
            setShowWinLine(false);
        },
        createRoom: (selectedMode, nextOpponent) => {
            const { socket, customSize, setPlayerState, mode, player, isPlayingWith, roomId } = get();
            if (selectedMode === "online") {
                setPlayerState("online");
                if (isPlayingWith === 'friends') socket.emit("createRoom", customSize, mode, player);
                if (isPlayingWith === 'randomUser') {
                    if (!roomId) {
                        // first player creates
                        socket.emit("createRoom", customSize, mode, player);
                        get().setNextOpponent(nextOpponent);
                    }
                }
            } else {
                get().setError("User is not Online")
            }
        },
        joinRoom: (roomId) => {
            const { setShowWinLine, setRoomId, socket, setPlayerState, player } = get();
            if (!socket) {
                get().setError("Socket not connected yet");
                return;
            }
            setPlayerState("online");
            const trimmedId = roomId.trim();
            setRoomId(trimmedId);
            socket.emit("joinGame", trimmedId, player);
            setShowWinLine(false);
        },
        cleanup: () => {
            set({
                roomId: '',
                socketId: null,
                opponentUser: {},
                playersInfo: [],
                isPlaying: false,
                currentPlayer: null,
                status: "",
                winLineStyle: {},
                showWinLine: false,
                boardLocked: false,
                winCells: [],

                customWin: 3,
                customSize: 3,
                player: {},
                playerState: '',
                mode: '',
                startPlay: false,
                boardState: Array(9).fill(null),

                round: 1,
                score: 0,
                gameOver: false,
                timer: 60,
                intervalId: null,
                selectedIcon: { id: "X", icon: XIcon },
                opponentIcon: { id: "0", icon: OIcon },
                selectedColor: { id: "red", bg: "bg-red-500", border: "border-red-400" },
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