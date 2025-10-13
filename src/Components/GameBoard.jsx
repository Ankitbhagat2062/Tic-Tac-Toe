import { useEffect, useRef } from "react";
import { useShallow } from 'zustand/shallow';
import { toast } from "react-toastify";

import useOnlinePlayStore from "../store/onlinePlayStore";
import { Icons } from "../Assets/colors";

const GameBoard = () => {

    // pick the state values you need
    const {
        boardState,
        status,
        showWinLine,
        winLineStyle,
        roomId,
        currentPlayer,
        setCurrentPlayer,
        winCells,
        setBoardState,
        setStatus
    } = useOnlinePlayStore(
        useShallow((state) => ({
            boardState: state.boardState,
            status: state.status,
            showWinLine: state.showWinLine,
            winLineStyle: state.winLineStyle,
            roomId: state.roomId,
            currentPlayer: state.currentPlayer,
            setCurrentPlayer: state.setCurrentPlayer,
            winCells: state.winCells,
            setRoomId: state.setRoomId,
            setBoardState: state.setBoardState,
            setStatus: state.setStatus,
        }))
    );
    const { play, loop, socket, cleanup } = useOnlinePlayStore();
    const { newGame, boardElClick, handleRoundOver, checkDraw, checkWinner, generateWinningPatterns, aiMove } = useOnlinePlayStore();

    const playerState = useOnlinePlayStore((state) => state.playerState);
    const player = useOnlinePlayStore((state) => state.player);
    const gameOver = useOnlinePlayStore((state) => state.gameOver);
    const opponentUser = useOnlinePlayStore((state) => state.opponentUser);
    const customWin = useOnlinePlayStore((state) => state.customWin);
    const customSize = useOnlinePlayStore((state) => state.customSize);
    const setRef = useOnlinePlayStore((s) => s.setRef);

    const overlayRef = useRef(null);
    const totalGameWonRef = useRef(null);
    const boardElRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        setRef("board", boardElRef.current);
        setRef("overlay", overlayRef.current);
        setRef("totalGameWon", totalGameWonRef.current);
        setRef("line", lineRef.current);
    }, [setRef]);

    const makeMove = (index) => {
        const winConditions = generateWinningPatterns(customSize, customSize, customWin);
        // If it's the very first turn, only Player X can play
        if (playerState === 'online') {
            if (boardState.every(c => c === null) && player?.user?.username !== currentPlayer) {
                loop("wrongClickSound", false);  // set background music to loop
                play("wrongClickSound");
                toast.error("Player who created Room goes first!");
                (currentPlayer) ? setStatus(`${currentPlayer} created Room So This is ${currentPlayer} turn`) : setStatus("Player who created Room goes first!");
                return;
            }

            // If it's not this player's turn
            if (player?.user?.username !== currentPlayer) {
                play("wrongClickSound");
                toast.error(`It's Player ${currentPlayer}'s turn!`);
                setStatus(`It's Player ${currentPlayer}'s turn!`);
                return;
            }
            // Only emit move if cell is empty and it is your turn
            if (boardState[index] === null && player?.user?.username === currentPlayer) {
                loop("cellclickSound", false)
                play("cellclickSound");
                socket.emit("makeMove", roomId, index, player, winConditions);
            }
        }
        // ---------- OFFLINE: HUMAN vs AI ----------
        if (playerState === 'offline') {
            if (opponentUser?.user?.username === 'AI') {
                aiMove(index);
            }
            // ---------- OFFLINE: HUMAN vs HUMAN (local) ---------- {
            else {
                // 2️⃣  Track current turn by ID, not JSX
                const newBoard = [...boardState];
                if (newBoard[index] !== null) {
                    toast.error("This cell is already filled!");
                    play("wrongClickSound");
                    return;
                }

                // Find the correct symbol to place
                const Symbol = currentPlayer || player.user.username
                newBoard[index] = Symbol;
                setBoardState(newBoard);
                play("cellclickSound");
                // Check win/draw
                const result = checkWinner(newBoard, customSize, customSize, customWin);
                if (result?.winner) {
                    console.log("Winner:", result.winner , result.cells);
                    handleRoundOver(`Player ${result?.winner} wins!`, result?.winner, result?.cells);
                    return;
                }

                if (checkDraw(newBoard)) {
                    handleRoundOver(`It's a draw!`, null, []);
                    return;
                }

                // Switch turn
                setCurrentPlayer(Symbol === player.user.username ? opponentUser.user.username : player.user.username);
                setStatus(`It's ${currentPlayer === player.user.username ? "Opponent" : "Your"} turn!`);
            }
        }
    };

    useEffect(() => {
        if (!showWinLine) return;
        setTimeout(() => {
            newGame()
        }, 500);
    }, [newGame, showWinLine])

    const renderBoard = () => {
        return boardState.map((value, index) => {
            if (player.symbol === null || opponentUser.symbol === null) return null;

            let icon = null, color = null;

            // Only render icon if cell is not empty
            if (value !== null) {
                if (player?.symbol?.id === opponentUser?.symbol?.id) {
                    icon = value === player?.user?.username
                        ? Icons.find((i) => i.id === player?.symbol?.id)
                        : Icons.find((i) => i.id === '0');
                    color = value === player?.user?.username
                        ? player?.symbol?.color
                        : { id: 'blue', bg: 'bg-blue-500', border: 'border-blue-400' };
                } else {
                    icon = value === player?.user?.username
                        ? Icons.find((i) => i.id === player?.symbol?.id)
                        : Icons.find((i) => i.id === opponentUser?.symbol?.id);
                    color = value === player?.user?.username
                        ? player?.symbol?.color
                        : opponentUser?.symbol?.color;
                }
            }

            return (
                <div
                    key={index}
                    className={`${showWinLine && winCells.includes(index)
                        ? '!bg-[#4CAF50] hover:*:bg-[#83e286]  font-bold transition-colors duration-300'
                        : 'bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] hover:bg-[linear-gradient(78deg,#7c90ee_0%,#c8c2c2_100%)]'}
              cell text-[36px] md:text-[48px] md:w-[100px] md:h-[100px] w-[60px] h-[60px] flex items-center justify-center
               cursor-pointer select-none rounded-md active:bg-[#e0e0e0]`}
                    onClick={() => makeMove(index)}
                >
                    {icon && (
                        <icon.icon stroke={color?.id} key={icon.id}
                            className={`relative rounded-full flex items-center justify-center transition w-12 h-12 flex-shrink-0
                        ${color?.bg} ${color?.border} hover:scale-105 shadow-lg scale-110
                     `}>
                        </icon.icon>
                    )}
                </div>
            );
        });
    };
    return (
        <>
            <div className="text-black flex flex-col justify-center items-center gap-2.5 p-2.5 font-sans">
                <div className="flex flex-col justify-center items-center gap-5 relative">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                        <div className="flex relative flex-col justify-center items-center">
                            <div className="text-lg font-bold text-[#333] mb-5 min-h-[24px]">{status}</div>
                            <div ref={boardElRef} onClick={boardElClick} className={`grid gap-2.5 p-[10px] rounded-md relative bg-blue-600`}
                                style={{ gridTemplateColumns: `repeat(${customSize}, 1fr)`, gridTemplateRows: `repeat(${customSize}, 1fr)` }}>
                                {renderBoard()}
                            </div>
                            <div ref={lineRef}
                                className={`absolute bg-red-500 rounded-[2px] pointer-events-none h-[4px] transition-width duration-300 ease ${showWinLine ? '' : 'hidden'}`}
                                style={winLineStyle}
                            ></div>
                        </div>
                    </div>

                </div>
                <div ref={overlayRef}
                    className={`board-overlay cursor-pointer absolute top-0 left-0 w-full h-full bg-[#000000bf] text-white text-2xl font-bold 
              flex justify-center items-center rounded-lg 
              transition-opacity duration-400 ease-in-out z-50
              ${gameOver ? 'opacity-100 pointer-events-auto animate-[fadeInText_0.6s_ease_forwards]' : 'opacity-0 pointer-events-none'}`}>
                    <div className="bg-cyan-600">
                        <div className=" relative rounded-2xl border-[6px] bg-cyan-600 border-blue-800 p-10 text-center max-w-md w-full shadow-[0_8px_0_0_rgba(0,0,0,0.25)] ">
                            {/* Title */}
                            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
                                Game Over
                            </h1>

                            {/* Subtitle */}
                            <p ref={totalGameWonRef} className="text-white text-2xl font-bold mb-8" >
                            </p>

                            {/* Button */}
                            <button onClick={cleanup}
                                className=" cursor-pointer bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold text-xl px-10 py-3 rounded-full border-4 border-blue-900 shadow-md hover:scale-105 transition-transform duration-200 ">
                                Continue
                            </button>
                        </div>
                    </div>

                </div>

                <div id="container"></div>
                <div id="result-message"></div>
                <button onClick={() => {
                    newGame();
                    loop("restartSound", false);
                    play("restartSound");
                }} className="bg-[#ff9800] text-white border-none rounded-[5px] cursor-pointer text-base mt-5 transition-colors duration-300 hover:bg-[#f57c00] px-2 py-1">
                    Reset Game
                </button>
            </div>
        </>
    );
}

export default GameBoard

