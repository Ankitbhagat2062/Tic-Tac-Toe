import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/shallow';
// import { motion } from "framer-motion";

import { TbArrowBackUp } from "react-icons/tb";
import useOnlinePlayStore from "../store/onlinePlayStore";
import { shadow } from "../css/colors";
import { FaAward, FaCaretLeft, FaCaretRight, FaCheck, FaCheckCircle, FaCheckSquare, FaCoins, FaForward, FaGem, FaMapPin, FaRegCircle } from 'react-icons/fa';
import { FiHelpCircle, FiMic } from 'react-icons/fi';

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
export const VoiceIcon = () => {
  return (
    <span className="absolute -top-4 -right-3">
      <div className="relative inline-flex items-center justify-center">
        {/* Bubble */}
        <div className="relative bg-blue-900 border-4 border-green-500 rounded-full w-8 h-8 flex items-center justify-center">
          <FiMic className="text-green-500 text-xl z-1" />

          {/* Top tail */}
          <div className="absolute -top-1.5 left-2 rotate-75 w-4.5 h-4.5 bg-blue-900 border-l-4 border-t-4 border-green-500"></div>
          {/* Bottom tail */}
          <div className="absolute top-3 -left-[3px] -rotate-15 w-4.5 h-4.5 bg-blue-900 border-l-4 border-b-4 border-green-500"></div>
        </div>
      </div>
    </span>
  )
}

import { tailwind500, colors, Icons } from "../css/colors";
import { IoIosLock } from 'react-icons/io';
export const SelectIcon = () => {
  const { selectedIcon, selectedColor, currentIndex, setSelectedIcon, setSelectedColor, setCurrentIndex, } = useOnlinePlayStore();
  const selectColor = (color) => {
    setSelectedColor(color);
  };
  const handleLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleRight = () => {
    setCurrentIndex(prev => Math.min(Icons.length - 4, prev + 1));
  };
  return (
    <>
      <div className="w-full max-w-md mb-3 border-yellow-300 bg-blue-600 pb-2">
        <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">Select Token / Icon</h2>
        <div className="flex justify-around flex-col gap-2.5 mx-2.5">
          <div className="w-full flex items-center justify-center">
            <button
              onClick={handleLeft}
              className={`flex-shrink-0 mr-4 p-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex === 0}
            >
              <FaCaretLeft className='text-yellow-300 h-8' />
            </button>
            <div className="overflow-hidden w-64 flex-shrink-0">
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${-currentIndex * 64}px)` }}
              >
                {Icons.map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`relative rounded-full flex items-center justify-center border-4 transition w-12 h-12 flex-shrink-0
                            ${selectedColor ? `${selectedColor.bg} ${selectedColor.border}` : `bg-gray-600 border-gray-500 hover:scale-105 shadow-lg scale-110`}
                            ${icon.isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                    style={{ "--bg-color-number": tailwind500[selectedColor?.bg] || "#6b7280" }}
                    disabled={icon.isLocked}
                  >
                    <icon.icon className={`h-8 w-8 rounded-full ${selectedIcon.id === icon.id ? `border-yellow-300 border-2 p-1` : 'border-none'}`} />
                    {(selectedIcon.id === icon.id && !icon.isLocked) && <FaCheckSquare className='absolute top-0 left-0 bg-yellow-300 text-blue-600' />}
                    {icon.isLocked && <IoIosLock className="absolute -top-1 -right-1 text-sm text-yellow-400" />}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleRight}
              className={`flex-shrink-0 ml-4 p-2 ${currentIndex === Icons.length - 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex === Icons.length - 4}
            >
              <FaCaretRight className='text-yellow-300 h-8' />
            </button>
          </div>
          <div className="w-full bg-white h-1"></div>
          <div className="colors flex justify-center items-center gap-4 transition-transform duration-500 ease-in-out">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => selectColor(color)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition flex-shrink-0 ${color.bg} 
                        ${selectedColor.id === color.id && `outline-2 outline-white`} ${color.border} shadow-lg scale-110`}
              >
                {selectedColor.id === color.id && <FaCheck />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const SelectGame = () => {
  const { selectedGame, setSelectedGame, setMode } = useOnlinePlayStore();
  return (
    <>
      <div className="w-full max-w-md mb-3 px-2 bg-blue-800 py-4 border-2 border-yellow-300">
        <h2 className="text-xl font-bold mb-4 text-center text-yellow-500 flex items-center justify-center gap-2">
          Select Game
          <FiHelpCircle className="text-yellow-400" />
        </h2>
        <div className="flex justify-around">
          {['Classic', 'popular', 'Custom'].map((game) => (
            <button
              key={game}
              onClick={() => {
                setSelectedGame(game);
                setMode(game);
              }}
              className={`relative p-3 rounded-lg transition-all duration-300 ${selectedGame === game
                ? 'bg-blue-700 shadow-lg scale-105 border-2 border-yellow-300'
                : 'bg-gray-700 hover:bg-gray-600 border-2 border-white/50'
                }`}
            >
              <div className="flex items-center justify-center mb-1">
                {selectedGame === game ? (
                  <FaCheckCircle className="text-yellow-400 text-lg" />
                ) : (
                  <FaRegCircle className="text-white text-lg" />
                )}
              </div>
              <div className="text-center text-sm font-bold text-white capitalize">
                {game}
              </div>
              {game === 'Classic' && (
                <FaMapPin className={`absolute -top-1 -left-1 text-yellow-400 text-sm ${selectedGame === game ? 'text-white' : ''}`} />
              )}
              {game === 'popular' && (
                <FaAward className={`absolute -top-1 -right-1 text-yellow-400 text-sm ${selectedGame === game ? 'text-white' : ''}`} />
              )}
              {game === 'Custom' && (
                <FaForward className={`absolute -top-1 -right-1 text-yellow-400 text-sm ${selectedGame === game ? 'text-white' : ''}`} />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

import { useState } from "react";
import { motion } from "framer-motion";

// ✅ Opponent chooser with animation + auto room creation/join
export const SearchUser = ({ user, onlineUser, createRoom, roomId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showName, setShowName] = useState(false); // controls username display
  const { setStartPlay } = useOnlinePlayStore();

  useEffect(() => {
    if (!onlineUser.length) toast('No user connected');
    if (!onlineUser.length) return;

    // Cycle through users every 1s
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % onlineUser.length);
      setShowName(false); // hide name until animation finishes
    }, 1000);

    // After one full cycle → pick a random opponent
    const timeout = setTimeout(() => {
      clearInterval(interval);
      const randomUser =
        onlineUser[Math.floor(Math.random() * onlineUser.length)];
      setSelectedUser(randomUser);
    }, 1000 * onlineUser.length);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onlineUser]);

  const currentOpponent = selectedUser || onlineUser[currentIndex];
  const nextOpponent = onlineUser[(currentIndex + 1) % onlineUser.length] || currentOpponent;

  // ✅ Called when animation of "nextOpponent" finishes
  // Animation end handler
  const handleAnimationEnd = () => {
    if(!onlineUser.length) return;
    setShowName(true);
    setStartPlay(true);
    if (!roomId) {
      // If room not created yet → create one
      createRoom("online",user,nextOpponent)
    } else {
      // If room already created → join it
      // joinRoom(roomId , user);
    }
  };

  return (
    <div className="flex items-center justify-between w-full mt-6">
      {/* Current User */}
      <div className="flex flex-col items-center">
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-sm border-4 border-red-500 object-cover"
        />
        <span className="text-white font-bold mt-2 text-center">
          {user?.username || "Player 1"}
        </span>
      </div>

      {/* VS */}
      <span className="text-green-500 text-3xl font-bold mx-4 animate-pulse">
        VS
      </span>

      {/* Opponent */}
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center flex-col w-28 h-28 overflow-hidden">
          {/* Current image sliding out */}
          <img
            key={`current-${currentIndex}`}
            src={currentOpponent?.profilePicture || "/images/player.png"}
            alt="Opponent"
            className="absolute w-24 h-24 rounded-sm border-4 border-red-500 object-cover animate-[slideOut_1s_ease-in-out_forwards]"
          />

          {/* Next image sliding in */}
          <img
            key={`next-${currentIndex}`}
            src={nextOpponent?.profilePicture || "/images/player.png"}
            alt="Next Opponent"
            className="absolute w-24 h-24 rounded-sm border-4 border-red-500 object-cover animate-[slideIn_1s_ease-in-out_forwards]"
            onAnimationEnd={handleAnimationEnd} // ✅ triggers when animation ends
          />
        </div>

        {/* Opponent name only after animation ends */}
        {showName ? (
          <motion.div>
            {nextOpponent?.username || "???"}
          </motion.div>
        ):(
          <p>{nextOpponent?.profilePicture ? 'Searching...' : "No User Found"}</p>
        )}
      </div>
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
    toast('Privacy settings clicked!');
    // Implement navigation or modal for privacy settings
  };

  const handleFeedbackClick = () => {
    toast('Feedback button clicked!');
    // Implement navigation or modal for feedback
  };
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

export const TotalCash = ({ totalCoins, diamonds }) => {
  return (
    <div className="flex justify-between w-full max-w-md mb-4 pt-4">
      <div className="flex items-center justify-center rounded-lg px-3">
        <FaCoins className="text-yellow-400" />
        <span>{totalCoins}</span>
      </div>
      <div className="text-center flex flex-col gap-2">
        <div className="text-lg font-bold flex justify-center items-center"><FaGem className="text-purple-400" />{diamonds}</div>
        <span className="text-sm bg-blue-800 rounded-lg px-3 py-1 border-2 border-amber-400">Game History</span>
      </div>
    </div>
  )
}

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
  const playerSymbolRef = useRef(playerSymbol);

  const setRef = useOnlinePlayStore((s) => s.setRef);
  const { newGame, boardElClick, handleRoundOver, checkDraw, checkWinner, generateWinningPatterns, aiMove } = useOnlinePlayStore();

  useEffect(() => {
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
      if (opponentUser?.user?.username === 'AI') {
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
        play("cellclickSound");
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
