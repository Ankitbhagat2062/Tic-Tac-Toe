import React, { useEffect } from "react";
import useGameStore from "../store/useGameStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const TicTacToe = () => {
  const {
    board,
    currentPlayer,
    mode,
    level,
    showResult,
    resultMessage,
    setBoard,
    setCurrentPlayer,
    setMode,
    setLevel,
    play,
    loop,
    setShowResult,
    resetGame,
  } = useGameStore();

  // --- Initialize bg music
  useEffect(() => {
    loop("bgMusic", true);
    play("bgMusic");
  }, [loop, play]);

  // --- Handle cell click
  const handleClick = (index) => {
    if (board[index] || showResult) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    play("clickSound");

    const winner = checkWinner(newBoard);
    if (winner) {
      play("winMusic");
      loop("bgMusic", false);
      setShowResult(true, `Player ${winner} wins!`);
      setLevel(level + 1);
    } else if (checkDraw(newBoard)) {
      play("drawMusic");
      loop("bgMusic", false);
      setShowResult(true, "It's a draw!");
    } else {
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      // --- AI move
      if (mode === "computer" && nextPlayer === "O") {
        computerMove(newBoard);
      }
    }
  };

  const computerMove = (boardState) => {
    const emptyCells = boardState.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...boardState];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);
    play("clickSound");

    const winner = checkWinner(newBoard);
    if (winner) {
      play("winMusic");
      loop("bgMusic", false);
      setShowResult(true, `Player ${winner} wins!`);
      setLevel(level + 1);
    } else if (checkDraw(newBoard)) {
      play("drawMusic");
      loop("bgMusic", false);
      setShowResult(true, "It's a draw!");
    } else {
      setCurrentPlayer("X");
    }
  };

  // --- Winner/draw logic
  const checkWinner = (boardState) => {
    const winConds = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let cond of winConds) {
      const [a,b,c] = cond;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c])
        return boardState[a];
    }
    return null;
  };

  const checkDraw = (boardState) => boardState.every(cell => cell !== null);

  return (
    <div className="game-container">
      <h2>Tic Tac Toe - Level {level}</h2>

      <div className="mode-buttons">
        <button onClick={() => { setMode("multiplayer"); resetGame(); }}>Multiplayer</button>
        <button onClick={() => { setMode("computer"); resetGame(); }}>Computer</button>
      </div>

      <div className="board">
        {board.map((cell, idx) => (
          <div key={idx} className="cell" onClick={() => handleClick(idx)}>
            {cell}
          </div>
        ))}
      </div>

      {showResult && (
        <div className="result-screen">
          <p>{resultMessage}</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
