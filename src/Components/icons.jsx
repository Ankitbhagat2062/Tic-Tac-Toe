import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/shallow';


import { TbArrowBackUp } from "react-icons/tb";
import useOnlinePlayStore from "../store/onlinePlayStore";
import { shadow } from "../css/colors";

export function AutoColorX({ size = 48, className = "" }) {
  return (
    <svg
      className={`${className} bg-white`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="X"
    >
      <g
        stroke="var(--bg-color-number)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M6 6 L18 18" />
        <path d="M18 6 L6 18" />
      </g>
    </svg>
  );
}

export function AutoColorO({ size = 48, className = "" }) {
  return (
    <svg
      className={`${className} bg-white`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="O"
    >
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="var(--bg-color-number)"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}

export const Player = ({ player, symbol }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-blue-700 rounded-lg md:p-6 md:w-32 md:h-40 w-18 h-24 shadow-lg">
        <div className="md:w-16 md:h-20 w-7 h-9 flex items-center justify-center bg-blue-900 rounded-md mb-2">
          <span className="md:text-6xl text-2xl text-cyan-400 font-extrabold">{symbol}</span>
        </div>
        <span className="text-white font-semibold md:text-lg text-sm">{player}</span>
      </div>
    </>
  )
}

export const GooglePlayIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main big triangle background (Sky Blue) */}
    <path d="M96 32 L416 256 L96 480 Z" fill="#00AEEF" />

    {/* Green region (upper median slice) */}
    <path d="M96 32 L256 256 L416 256 Z" fill="#32A350" />

    {/* Red region (lower median slice) */}
    <path d="M96 480 L256 256 L416 256 Z" fill="#FF4229" />

    {/* Yellow small center (intersection of medians) */}
    <path d="M96 32 L96 480 L256 256 Z" fill="#FFD500" />
  </svg>
);

export const ToggleSwitch = ({ label, checked, onToggle, onColor, offColor, thumbColor }) => {
  return (
    <div className="flex items-center mb-4">
      <span className="text-white text-2xl mr-5 grow">{label}</span>
      <label className="relative inline-block w-23 h-10">
        <input className='opacity-0 w-0 h-0'
          type="checkbox"
          checked={checked}
          onChange={onToggle}
        />
        <span
          className="slider round"
          style={{
            backgroundColor: checked ? onColor : offColor,
            '--thumb-color': thumbColor // Custom property for thumb color
          }}
        ></span>
      </label>
    </div>
  );
};

export const SettingsButton = () => {
  const { setIsPlaying, setMusicOn, setShowSetting } = useOnlinePlayStore();
  const musicOn = useOnlinePlayStore((state) => state.musicOn)
  const isPlaying = useOnlinePlayStore((state) => state.isPlaying)
  const showSetting = useOnlinePlayStore((state) => state.showSetting)
  const handleMusicToggle = () => {
    setMusicOn((prevMusicOn) => {
      const newMusicOnState = !prevMusicOn;
      const audio = useOnlinePlayStore.getState().audios.bgMusic;

      // IMPORTANT: Check if audio exists before trying to access its methods
      if (audio && typeof audio.play === 'function' && typeof audio.pause === 'function') {
        if (newMusicOnState) { // If music is turning ON
          audio.currentTime = 0;
          // Ensure play() returns a Promise. If it doesn't, .catch() will fail.
          // Some older browser implementations or non-standard audio elements might not return a Promise.
          try {
            const playPromise = audio.play();
            if (playPromise) { // Check if it's actually a promise
              playPromise.catch((error) => {
                console.error('Error playing background music:', error);
              });
            }
          } catch (error) {
            console.error('Error initiating play on background music:', error);
          }
        } else { // If music is turning OFF
          try {
            const pausePromise = audio.pause();
            if (pausePromise) { // Check if it's actually a promise (though pause is often synchronous)
              pausePromise.catch((error) => { // Pause can also return a Promise in some contexts
                console.error('Error pausing background music:', error);
              });
            }
          } catch (error) {
            console.error('Error initiating pause on background music:', error);
          }
        }
      } else {
        console.warn("Background music audio object or its methods are not available.");
      }
      return newMusicOnState;
    });
  };

  const handleSoundToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrivacyClick = () => {
    alert('Privacy settings clicked!');
    // Implement navigation or modal for privacy settings
  };

  const handleFeedbackClick = () => {
    alert('Feedback button clicked!');
    // Implement navigation or modal for feedback
  };
  console.log("musicOn is :", musicOn)
  return (
    <div className="bg-[#000000de] z-101 min-h-screen text-white font-sans 
    absolute top-1 flex flex-col items-center justify-center px-4 w-full overflow-hidden gap-5">
      <div className={`${shadow} py-2 px-4`}>
        <h1 className="text-yellow-400 text-2xl font-extrabold w-full text-center mb-5">
          <span>SETTINGS</span></h1>

        <ToggleSwitch
          label="Music"
          checked={musicOn}
          onToggle={handleMusicToggle}
          onColor="green" // Adjust color to match image if needed
          offColor="red"  // Adjust color to match image if needed
          thumbColor="white" // White thumb for both states
        />

        <ToggleSwitch
          label="Sound"
          checked={isPlaying}
          onToggle={handleSoundToggle}
          onColor="green"
          offColor="red"
          thumbColor="white"
        />
        <div className="button-group">
          <button className="bg-[#2196F3] text-white py-3 px-5 m-2.5 border-2 border-[#FFD700] rounded-[25px] text-[22px] font-bold cursor-pointer transition-[background-color,shadow-[0_0_8px_rgba(255,215,0,0.7)]] duration-300 ease-in-out shadow-[0_0_8px_rgba(255,215,0,0.7)] text-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] hover:bg-[#1976D2] hover:shadow-[0_0_12px_rgba(255,215,0,1)] active:bg-[#0d47a1]"
            onClick={handlePrivacyClick}>
            Privacy
          </button>
          <button className="bg-[#2196F3] text-white py-3 px-5 m-2.5 border-2 border-[#FFD700] rounded-[25px] text-[22px] font-bold cursor-pointer transition-[background-color,shadow-[0_0_8px_rgba(255,215,0,0.7)]] duration-300 ease-in-out shadow-[0_0_8px_rgba(255,215,0,0.7)] text-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] hover:bg-[#1976D2] hover:shadow-[0_0_12px_rgba(255,215,0,1)] active:bg-[#0d47a1]"
            onClick={handleFeedbackClick}>
            Feedback
          </button>
        </div>
      </div>
      <div className={`${shadow} py-1 px-2`}>
        <button onClick={() => setShowSetting(!showSetting)}>
          <TbArrowBackUp className='h-8 w-8 text-yellow-500' />
        </button>
      </div>
    </div>
  );
};

export const GameBoard = () => {

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
    setBoardState,
    setStatus
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
      setStatus: state.setStatus,
    }))
  );

  const { play, loop, socket, cleanup } = useOnlinePlayStore();

  const playerState = useOnlinePlayStore((state) => state.playerState);
  const gameOver = useOnlinePlayStore((state) => state.gameOver);
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser);


  const customWin = useOnlinePlayStore((state) => state.customWin);
  const customSize = useOnlinePlayStore((state) => state.customSize);

  const overlayRef = useRef(null);
  const totalGameWonRef = useRef(null);
  const boardElRef = useRef(null);
  const lineRef = useRef(null);
  const msgRef = useRef(null);
  const playerSymbolRef = useRef(playerSymbol);

  const setRef = useOnlinePlayStore((s) => s.setRef);
  const { newGame, boardElClick, handleRoundOver, checkDraw, checkWinner, generateWinningPatterns, aiMove } = useOnlinePlayStore();

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
    const winConditions = generateWinningPatterns(customSize, customSize, customWin);
    // If it's the very first turn, only Player X can play
    if (playerState === 'online') {
      if (boardState.every(c => c === null) && playerSymbol === "O") {
        loop("wrongClickSound", false);  // set background music to loop
        play("wrongClickSound");
        toast.error("Player who created Room goes first!");
        (currentPlayer) ? setStatus(`${currentPlayer} created Room So This is ${currentPlayer} turn`) : setStatus("Player who created Room goes first!");
        return;
      }

      // If it's not this player's turn
      if (playerSymbol !== currentPlayer) {
        play("wrongClickSound");
        toast.error(`It's Player ${currentPlayer}'s turn!`);
        setStatus(`It's Player ${currentPlayer}'s turn!`);
        return;
      }

      // Only emit move if cell is empty and it is your turn
      if (boardState[index] === null && playerSymbol === currentPlayer) {
        loop("cellclickSound", false)
        play("cellclickSound");
        socket.emit("makeMove", roomId, index, playerSymbol, winConditions);
      }
    }
    // ---------- OFFLINE: HUMAN vs AI ----------
    if (playerState === 'offline') {
      if (opponentUser.username === 'AI') {
        aiMove(index);
      }
      // ---------- OFFLINE: HUMAN vs HUMAN (local) ---------- {
      else {
        // use currentPlayer to decide which symbol to place
        const symbol = currentPlayer || "X"; // ensure defined
        const newBoard = [...boardState];
        if (newBoard[index] !== null) {
          toast.error("This cell is already filled!");
          play("wrongClickSound");
          return;
        }
        newBoard[index] = symbol;
        setBoardState(newBoard);
        setPlayerSymbol("X");
        play("cellClickSound");
        (playerSymbol === currentPlayer && currentPlayer) && setStatus(`It's Player ${currentPlayer}'s turn!`);
        // check win/draw
        const winner = checkWinner(newBoard, customSize, customSize, customWin);
        if (winner?.winner) {
          handleRoundOver(`Player ${winner?.winner} wins!`, winner?.winner, winner?.cells);
          return;
        }
        if (checkDraw(newBoard)) {
          handleRoundOver(`It's a draw!`, null, []);
          return;
        }

        // toggle currentPlayer for next local turn
        setCurrentPlayer(symbol === "X" ? "O" : "X");
        return;
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
    return boardState.map((value, index) => (
      <div
        key={index}
        className={`${showWinLine && winCells.includes(index)
          ? '!bg-[#4CAF50] hover:*:bg-[#83e286]  font-bold transition-colors duration-300'
          : 'bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] hover:bg-[linear-gradient(78deg,#7c90ee_0%,#c8c2c2_100%)]'} 
          cell text-[36px] md:text-[48px] md:w-[100px] md:h-[100px] w-[60px] h-[60px] flex items-center justify-center
           cursor-pointer select-none rounded-md active:bg-[#e0e0e0]
          ${value === 'X' ? 'text-red-600' : 'text-green-500'}`}
        onClick={() => makeMove(index)}
      >
        {value}
      </div>
    ));
  };
  return (
    <>
      <div className="text-black flex flex-col justify-center items-center gap-2.5 p-2.5 font-sans">
        <div className="flex flex-col justify-center items-center gap-5 relative">
          <div className="flex flex-col items-center justify-center gap-2.5">
            {playerState === 'online' && (
              <div className="mb-5 flex justify-center items-center">
                < h2 className='text-[#666] text-sm mb-2.5' ref={msgRef}></h2>
              </div>
            )}

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
        <button onClick={ () => {
          newGame();
          loop("restartSound" , false);
          play("restartSound");
        }} className="bg-[#ff9800] text-white border-none rounded-[5px] cursor-pointer text-base mt-5 transition-colors duration-300 hover:bg-[#f57c00] px-2 py-1">
          Reset Game
        </button>
      </div>
    </>
  );
}
