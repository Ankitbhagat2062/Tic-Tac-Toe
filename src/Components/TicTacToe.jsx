import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useShallow } from 'zustand/shallow';


import './TicTacToe.css';
import useOnlinePlayStore from "../store/onlinePlayStore";

function TicTacToe() {

  // pick the state values you need
  const {
    boardState,
    status,
    showWinLine,
    winLineStyle,
    playerSymbol,
    setPlayerSymbol,
    roomId,
    currentPlayer,
    setCurrentPlayer,
    winCells,
    setRoomId,
    setBoardState
  } = useOnlinePlayStore(
    useShallow((state) => ({
      boardState: state.boardState,
      status: state.status,
      showWinLine: state.showWinLine,
      winLineStyle: state.winLineStyle,
      playerSymbol: state.playerSymbol,
      setPlayerSymbol: state.setPlayerSymbol,
      roomId: state.roomId,
      currentPlayer: state.currentPlayer,
      setCurrentPlayer: state.setCurrentPlayer,
      winCells: state.winCells,
      setRoomId: state.setRoomId,
      setBoardState: state.setBoardState,
    }))
  );

  const { play, loop, socket } = useOnlinePlayStore();

  const playerState = useSelector((state) => state.game.playerState)
  const player = useSelector((state) => state.game.player)
  const overlayRef = useRef(null);
  const totalGameWonRef = useRef(null);
  const boardElRef = useRef(null);
  const lineRef = useRef(null);
  const msgRef = useRef(null);
  const playerSymbolRef = useRef(playerSymbol);

  const setRef = useOnlinePlayStore((s) => s.setRef);
  const { createRoom, joinRoom, newGame, boardElClick, handleGameOver, checkDraw, checkWinner, getWinningCells, aiMove } = useOnlinePlayStore();
  // Redux dispatch

  useEffect(() => {
    setRef("msg", msgRef.current);
    setRef("board", boardElRef.current);
    setRef("overlay", overlayRef.current);
    setRef("totalGameWon", totalGameWonRef.current);
    setRef("line", lineRef.current);
    setRef("playerSymbol", playerSymbol); // not a DOM node, just a value
  }, [playerSymbol, setRef]);

  // Update ref whenever playerSymbol changes
  useEffect(() => {
    playerSymbolRef.current = playerSymbol;
  }, [playerSymbol]);

  const makeMove = (index) => {
    // If it's the very first turn, only Player X can play
    if (playerState === 'online') {
      if (boardState.every(c => c === null) && playerSymbol === "O") {
        loop("bgMusic", false);  // set background music to loop
        play("bgMusic");
        toast("Player who created Room goes first!");
        return;
      }

      // If it's not this player's turn
      if (playerSymbol !== currentPlayer) {
        play("wrongClickSound");
        toast(`It's Player ${currentPlayer}'s turn!`);
        return;
      }

      // Only emit move if cell is empty and it is your turn
      if (boardState[index] === null && playerSymbol === currentPlayer) {
        play("clickSoundRef");
        socket.emit("makeMove", roomId, index, playerSymbol);
      }
    }
    // ---------- OFFLINE: HUMAN vs AI ----------
    if (playerState === 'offline' && player === 'AI') {
      aiMove(index);
    }
    // ---------- OFFLINE: HUMAN vs HUMAN (local) ----------
    if (playerState === 'offline' && player !== 'AI') {
      // use currentPlayer to decide which symbol to place
      const symbol = currentPlayer || "X"; // ensure defined
      const newBoard = [...boardState];
      newBoard[index] = symbol;
      setBoardState(newBoard);
      setPlayerSymbol("X");
      play("clickSound");

      // check win/draw
      const winner = checkWinner(newBoard);
      if (winner) {
        handleGameOver(`Player ${winner} wins!`, winner, getWinningCells(newBoard));
        return;
      }
      if (checkDraw(newBoard)) {
        handleGameOver(`It's a draw!`, null, []);
        return;
      }

      // toggle currentPlayer for next local turn
      setCurrentPlayer(symbol === "X" ? "O" : "X");
      return;
    }
  };

  const renderBoard = () => {
    return boardState.map((value, index) => (
      <div
        key={index}
        className={`${showWinLine && winCells.includes(index)
          ? '!bg-[#4CAF50] hover:*:bg-[#83e286] text-white font-bold transition duration-300'
          : 'bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] hover:bg-[linear-gradient(78deg,#7c90ee_0%,#c8c2c2_100%)]'} cell  `}
        onClick={() => makeMove(index)}
      >
        {value}
      </div>
    ));
  };
  console.log(`PlayerSymbol is ${playerSymbol} and currentPlayer is ${currentPlayer}`)
  return (
    <>
      <ToastContainer />
      <div className="text-black flex flex-col justify-center items-center gap-2.5 p-2.5 font-sans">


        <div className="board-wrapper relative">
          <div className="flex flex-col items-center justify-center gap-2.5">
            {playerState === 'online' && (
              <>
                <div className="socket-test flex justify-center items-center">
                  <div ref={msgRef}></div>
                </div>
                <div className="room-controls flex justify-center items-center">
                  <input
                    id="roomInput"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                  />
                  <button id="createBtn" onClick={() => createRoom("online")}>
                    Create Room
                  </button>
                  <button id="joinBtn" onClick={() => joinRoom(roomId)}>
                    Join Room
                  </button>
                </div>
              </>
            )}

            <div className="game-area">
              <div id="status">{status}</div>
              <div ref={boardElRef} id="board" onClick={boardElClick} className="board bg-blue-600">
                {renderBoard()}
              </div>
              <div ref={lineRef}
                className={`win-line ${showWinLine ? '' : 'hidden'}`}
                style={winLineStyle}
              ></div>
            </div>
          </div>

        </div>
        <div ref={overlayRef}
          className={`board-overlay cursor-pointer absolute top-0 left-0 w-full h-full bg-cyan-600 text-white text-2xl font-bold 
              flex justify-center items-center rounded-lg 
              transition-opacity duration-400 ease-in-out z-50
              ${showWinLine ? 'opacity-100 pointer-events-auto animate-fadeInText' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="">
            <div className=" relative rounded-2xl border-[6px] border-blue-800 p-10 text-center max-w-md w-full shadow-[0_8px_0_0_rgba(0,0,0,0.25)] ">
              {/* Title */}
              <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
                Game Over
              </h1>

              {/* Subtitle */}
              <p ref={totalGameWonRef} className="text-white text-2xl font-bold mb-8" >
              </p>

              {/* Button */}
              <button onClick={newGame}
                className=" cursor-pointer bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold text-xl px-10 py-3 rounded-full border-4 border-blue-900 shadow-md hover:scale-105 transition-transform duration-200 ">
                Continue
              </button>
            </div>
          </div>

        </div>

        <div id="container"></div>
        <div id="result-message"></div>
        <button id="new-game-btn" onClick={newGame}>
          New Game
        </button>
      </div>
    </>
  );
}

export default TicTacToe;
