import { useEffect, useState } from "react";
import { FiPlus, FiMinus, } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdBrush } from "react-icons/io";
import { FaChild, FaCoins, FaExchangeAlt, FaMinus, FaPlus } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useShallow } from 'zustand/shallow';

import useAuthStore from "../store/useAuthStore";
import { initializeSocket, disconnectSocket } from '../services/socketService';
import useApp from '../hooks/useApp';
import TicTacToe from "./TicTacToe";
import Navbar from "./Navbar";

import useOnlinePlayStore from "../store/onlinePlayStore";
import { Player, SearchUser, SelectGame, SelectIcon, SettingsButton, TotalCash } from './icons'
import LudoLobby from "./LudoLobby";
import { shadow } from "../css/colors";

const Home = () => {
  const { token, } = useApp();

  const playerSymbol = useOnlinePlayStore((state) => state.playerSymbol);
  const { initsocketListeners, cleanup, socket , createRoom , joinRoom} = useOnlinePlayStore();
  const { fetchUser, user } = useAuthStore();

  const { setIsPlayingWith, setPlayer, setOpponentUser, setStartPlay, setMode, setPlayerState, setCustomWin, setCustomSize, setBoardState } = useOnlinePlayStore(
    useShallow((state) => ({
      setPlayer: state.setPlayer,
      setIsPlayingWith: state.setIsPlayingWith,
      setOpponentUser: state.setOpponentUser,
      setStartPlay: state.setStartPlay,
      setMode: state.setMode,
      setPlayerState: state.setPlayerState,
      setCustomWin: state.setCustomWin,
      setCustomSize: state.setCustomSize,
      setBoardState: state.setBoardState,
    })));


  // Redux state selectors
  const isPlayingWith = useOnlinePlayStore((state) => state.isPlayingWith)
  const player = useOnlinePlayStore((state) => state.player)
  const startPlay = useOnlinePlayStore((state) => state.startPlay);
  const customWin = useOnlinePlayStore((state) => state.customWin);
  const customSize = useOnlinePlayStore((state) => state.customSize);
  const mode = useOnlinePlayStore((state) => state.mode);
  const roomId = useOnlinePlayStore((state) => state.roomId);
  const playerState = useOnlinePlayStore((state) => state.playerState)
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser)
  const onlineUsers = useOnlinePlayStore((state) => state.onlineUsers)
  const [progress, setProgress] = useState(0);
  const { startTimer, showSetting, setShowSetting, setEntryAmount, entryAmount, step, setStep } = useOnlinePlayStore();
  
  // const { timer } = useOnlinePlayStore();
  useEffect(() => {
    fetchUser();
  }, [token, fetchUser,]);

  // start socket listeners
  useEffect(() => {
    if (!token) return;

    const socket = initializeSocket();
    if (socket) {
      initsocketListeners();
    }
    // disconnect ONLY when page unloads (refresh/close)
    const handleBeforeUnload = () => {
      disconnectSocket();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      cleanup()
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token, cleanup, initsocketListeners]);

  // Simulate loading progress
  useEffect(() => {
    const loader = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loader);
          return 100;
        }
        return prev + 1;
      });
    }, 10); // ~4s
    return () => clearInterval(loader);
  }, []);
  const handleSelectGame = (selectedMode) => {
    if (selectedMode === 'Classic') {
      setMode("Classic");
    } else if (selectedMode === 'Custom') {
      setMode("Custom");
    }
  }
  const handleStartGame = () => {
    if (!startPlay) {
      setStartPlay(true);
      setBoardState(Array(customSize * customSize).fill(null));
      startTimer();
    }
  }
  const handleSearchAllUser = () => {
    setTimeout(() => {
      setStep(2);
    }, 1000);
  }
  useEffect(() => {
    if(isPlayingWith === 'randomUser' && step === 2) socket.emit("user_connected", user);
  }, [socket, user , isPlayingWith , step]);
  
  const candidates = onlineUsers.filter(u => u.userId !== user.userId);

  return (
    <>
      <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] opacity-70 fixed inset-0 z-[-1]"></div>
      <div className=" font-[Arial,sans-serif]
  relative min-h-screen box-border flex flex-col items-center justify-center text-white overflow-hidden">

        {/* Header with Settings */}
        <AnimatePresence>
          <motion.div className={`fixed top-0 z-20 w-full`}>
            <Navbar />
          </motion.div>
        </AnimatePresence>
        <div onClick={() => {
          setShowSetting(!showSetting);
        }} className={`${shadow} overflow-hidden`}>
          <img src="./settings.gif" alt="Setting" className="brightness-110 w-8 h-8 grayscale contrast-[999] mix-blend-multiply bg-transparent" />
        </div>
        {showSetting && (
          <>
            <SettingsButton />
          </>
        )}
        {/* Floating animated dots background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none -z-10">
          <div className="w-full h-full animate-[moveDots_10s_linear_infinite] bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        {(player?.username?.length === 0 && mode.length === 0) && (
          <div className="mt-17.5 flex flex-col flex-wrap md:flex-row items-center justify-center gap-8 p-6 max-w-full mx-auto">
            <motion.div
              className="relative cursor-pointer group hover:scale-105 transition-transform duration-300"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setPlayerState("online");
                setIsPlayingWith('randomUser');
                setPlayer(user);
                setMode('Classic')
              }}
            >
              <div className="relative p-1 border-4 border-[#6e63c4] w-64 h-auto bg-yellow-500 rounded-2xl shadow-lg">
                {/* Blue top section */}
                <div className="relative rounded-t-2xl h-28 bg-blue-700 flex items-center justify-center overflow-hidden">

                  {/* Left Phone */}
                  <div className="absolute left-2 top-1/3 -rotate-15 -translate-y-1/2 w-12 h-16 rounded-xl shadow-md text-[70px] text-center mb-4">📱</div>
                  {/* Right Phone */}
                  <div className="absolute right-5 top-1/3 rotate-15 -translate-y-1/2 w-12 h-16 rounded-xl shadow-md text-[70px] text-center mb-4">📱</div>

                  {/* Globe */}
                  <FaEarthAsia size={48} color="yellow" className="z-10" />

                  {/* Rotating Orbit Dots */}
                  <motion.div
                    className="absolute w-18 h-18 border border-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `rotate(${i * 30}deg) translateX(48px)`,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Yellow bottom section with text */}
                <div className="flex items-center justify-center py-4 px-2">
                  <span className="text-blue-800 text-2xl font-bold uppercase tracking-wide">
                    Play Online
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative cursor-pointer rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setPlayerState("offline");
                setOpponentUser({ user: { username: "AI", profilePicture: "", }, symbol: 'O' });
                setIsPlayingWith("AI")
                setPlayer(user);
              }}
            >
              <div className={`relative p-1 border-4 border-[#6e63c4]  w-64 h-auto bg-yellow-500 rounded-2xl shadow-lg`}>
                {/* Blue top section */}
                <div className="relative rounded-t-2xl h-28 bg-blue-700 flex items-center justify-center p-4">

                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-18 h-24 bg-[#383838] border-6 border-black rounded-xl shadow-md flex items-center justify-center flex-col gap-1 px-2 pb-1 pt-1" >
                    <div className="bg-gray-400 w-6 h-2 rounded-full flex justify-around items-center px-0.5">
                      <div className="w-0.5 h-0.5 bg-black" />
                      <div className="w-0.5 h-0.5 bg-black" />
                      <div className="w-0.5 h-0.5 bg-black" />
                      <div className="w-0.5 h-0.5 bg-black" />
                    </div>
                    <div className="h-full flex items-center justify-center">
                      <h1 className="text-white text-3xl font-extrabold">VS</h1>
                    </div>
                    <div className="bg-gray-400 w-2 h-2 rounded-full"></div>
                  </div>
                </div>

                {/* Yellow bottom section with text */}
                <div className="flex items-center justify-center py-4 px-2">
                  <span className="text-blue-800 text-3xl font-bold uppercase tracking-wide">
                    Computer
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative cursor-pointer items-center justify-center flex rounded-2xl group hover:scale-105 transition-transform duration-300"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setPlayerState("offline");
                setOpponentUser({ user: { username: "Player 2", profilePicture: "" }, symbol: 'O' });
                setPlayer(user);
              }}
            >
              <div className={`relative p-1 border-4 border-[#6e63c4]  w-64 h-auto bg-yellow-500 rounded-2xl shadow-lg ${shadow}`}>
                {/* Blue top section */}
                <div className="relative rounded-t-2xl h-28 bg-blue-700 flex items-center justify-center p-4">
                  <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
                    <FaChild size={50} color="yellow" />
                  </div>
                  {/* You can add a subtle diamond shape in the middle if desired, similar to Ludo King */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 bg-yellow-400"></div>
                  <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2">
                    <FaChild size={50} color="yellow" />
                  </div>
                </div>

                {/* Yellow bottom section with text */}
                <div className="flex items-center justify-center py-4 px-2">
                  <span className="text-blue-800 text-3xl font-bold uppercase tracking-wide">
                    Pass N Play
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative cursor-pointer rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setPlayerState("online");
                setIsPlayingWith('friends')
                setPlayer(user);
              }}
            >
              <div className="relative p-1 border-4 border-[#6e63c4] w-64 h-auto bg-yellow-500 rounded-2xl shadow-lg">
                {/* Blue top section */}
                <div className="relative rounded-t-2xl h-28 bg-blue-700 flex items-center justify-center overflow-hidden">

                  {/* Left Phone */}
                  <div className="absolute left-2 top-1/3 -rotate-15 -translate-y-1/2 w-12 h-16 rounded-xl shadow-md text-[70px] text-center mb-4">📱</div>
                  {/* Right Phone */}
                  <div className="absolute right-5 top-1/3 rotate-15 -translate-y-1/2 w-12 h-16 rounded-xl shadow-md text-[70px] text-center mb-4">📱</div>

                  {/* Globe */}
                  <div size={48} color="yellow" className="z-10 w-full h-16 rounded-xl shadow-md text-[70px] text-center mb-4">💕</div>

                  {/* Rotating Orbit Dots */}
                  <motion.div
                    className="absolute w-18 h-18 border border-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `rotate(${i * 30}deg) translateX(48px)`,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Yellow bottom section with text */}
                <div className="flex items-center justify-center py-4 px-2">
                  <span className="text-blue-800 text-2xl font-bold uppercase tracking-wide">
                    Friends
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {isPlayingWith === 'randomUser' && !startPlay && (
          <div className={`${step === 2 ? 'bg-[#d62a30e0]' : 'bg-[#000000de]'} z-101 min-h-screen text-white font-sans 
    absolute top-1 flex flex-col items-center justify-start px-4 w-full overflow-hidden`}>
            <div className={`w-full flex items-center justify-center`}>
              <TotalCash />
            </div>
            {step === 0 && (
              <div className="step1 w-full items-center justify-center">
                <div className={`flex items-center justify-center flex-col`}>
                  <SelectGame className={`${shadow}`} />
                  {/* Next Button */}
                  <button onClick={()=>setStep(1)}
                    className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition mb-4 ${shadow}`}>
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="step2 flex flex-col w-full items-center justify-center">
                <SelectIcon />
                <div className="flex justify-center space-x-4 mb-4 items-center">
                  <button onClick={() => setEntryAmount(Math.max(100, entryAmount - 100))}
                    className={`flex items-center space-x-1 px-4 h-10 rounded-lg font-bold border-2 ${entryAmount <= 100 ? 'border-amber-400/35 bg-blue-900/35' : 'border-amber-400 bg-blue-400'}`}>
                    <FaMinus />
                  </button>
                  <div className="flex p-1 flex-col bg-yellow-300 rounded-xl">
                    <div className="flex flex-col items-center justify-center gap-2 bg-gray-400 rounded-t-xl p-2">
                      <FaCoins className='text-yellow-300' />
                      <span className='px-4 bg-gray-600 text-white rounded-xl'>{entryAmount}</span>
                    </div>
                    <span className='font-extrabold'>Entry</span>
                  </div>
                  <button onClick={() => setEntryAmount(entryAmount + 100)}
                    className={`flex items-center space-x-1 px-4 h-10 rounded-lg font-bold border-2 border-amber-400 bg-blue-400`}>
                    <FaPlus />
                  </button>
                </div>
                <button onClick={handleSearchAllUser}
                  className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition mb-4 ${shadow}`}>
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <>
                <div className="w-full max-w-md flex flex-col items-center p-5">
                  {/* Header */}
                  <div className="text-center py-3 mb-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 relative">
                      <span className="absolute top-[-20px] left-1/4 inline-block bg-[#FFD500] text-black text-center font-bold px-3 py-1 rounded-md font-sans rotate-[-6deg] clip-path-[polygon(0%_0%,_95%_0%,_100%_50%,_95%_100%,_0%_100%,_5%_50%)] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]">
                        PLAY
                      </span>
                      <h1 className="text-4xl font-extrabold tracking-wide">TIC TAC TOE</h1>
                    </div>
                  </div>

                  <h1 className="text-2xl font-extrabold text-yellow-400">ONLINE MULTIPLAYER</h1>
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-red-400 p-0.5">
                    <div className="flex items-center justify-center">
                      <div className="flex bg-red-400 w-35 rounded-tl-2xl py-1 px-3">
                        <span>Game Mode</span>
                      </div>
                      <div className="flex bg-red-500 w-35 rounded-tr-2xl py-1 px-3">
                        <span>Entry Amount</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex bg-red-600 w-35 rounded-bl-2xl py-1 px-3">
                        <span>{mode}</span>
                      </div>
                      <div className="flex bg-red-700 w-35 rounded-br-2xl py-1 px-3">
                        <span>{entryAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col items-center gap-6">

                    {/* Current user vs opponent */}
                    <SearchUser user={user} onlineUser={candidates} createRoom={createRoom} joinRoom={joinRoom} roomId={roomId} />
                  </div>

                  {/* Bottom Ready Button */}
                  <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition duration-300 shadow-lg">
                    Ready to Play
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {((mode.length === 0 && playerState === 'offline') && !startPlay) && (
          <>
            {/* Logo */}
            <div className="flex items-center space-x-2 relative">
              <span className="absolute top-[-20px] left-1/4 inline-block bg-[#FFD500] text-black text-center font-bold px-3 py-1 rounded-md font-sans rotate-[-6deg] clip-path-[polygon(0%_0%,_95%_0%,_100%_50%,_95%_100%,_0%_100%,_5%_50%)] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]">
                PLAY
              </span>
              <h1 className="text-4xl font-extrabold tracking-wide">TIC TAC TOE</h1>
            </div>

            {/* XO Row */}
            <div className="flex mt-6 bg-blue-600 rounded-lg">
              {["X", "X", "O"].map((char, i) => (
                <div key={i}
                  className={`w-16 h-16 border rounded-lg border-blue-400 flex items-center justify-center bg-blue-800
                    ${i === 0 ? 'mx-1 my-1' : ''}
                    ${i === 1 ? 'mx-0 my-1' : ''}
                    ${i === 2 ? 'mx-1 my-1' : ''}
                 `} >
                  <span className="text-4xl text-cyan-400 font-extrabold">{char}</span>
                </div>
              ))}
            </div>

            {/* Loading or Buttons */}
            <AnimatePresence>
              {progress < 100 ? (
                <motion.p
                  key="loading"
                  className="mt-8 text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  {progress}%
                </motion.p>
              ) : (
                <motion.div
                  key="buttons"
                  className="mt-10 flex space-x-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div
                    className="border-4 bg-blue-400 flex items-center justify-center border-blue-600 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transform transition"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  >
                    <button onClick={() => { handleSelectGame("Classic") }}
                      className="px-6 py-2 cursor-pointer bg-blue-800 border-2 border-blue-400 rounded-xl text-lg shadow-lg">
                      Classic
                    </button>
                  </motion.div>
                  <motion.div
                    className="border-4 bg-blue-400 flex items-center justify-center border-blue-600 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transform transition"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  >
                    <button onClick={() => { handleSelectGame("Custom") }}
                      className="px-6 py-2 cursor-pointer bg-blue-800 border-2 border-blue-400 rounded-xl text-lg shadow-lg">
                      Custom
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        {(mode === 'Classic' && player?.username.length > 0 && playerState.length > 0 && !startPlay) && (
          <>
            <div className="flex flex-col items-center space-y-8">
              <div className="flex items-center sm:space-x-12 flex-col sm:flex-row sm:mt-0 mt-10">
                {/* Player 1 Card */}
                <Player player={player?.username || "Player X"} symbol={playerSymbol || "X"} />
                {/* Middle Buttons */}
                <div className="flex flex-col items-center justify-center gap-5">
                  <div >
                    <h1 className="font-sans font-extrabold text-4xl">Vs</h1>
                  </div>
                  <div className="flex gap-5 justify-center space-y-4">
                    <button className="w-12 h-12 border-4 border-blue-400 outline-2 outline-blue-500 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 transition">
                      {/* Paintbrush Icon */}
                      <IoMdBrush className="h-6 w-6 text-white" />
                    </button>
                    <button className="w-12 h-12 border-4 border-blue-400 outline-2 outline-blue-500 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 transition">
                      {/* Swap Icon */}
                      {/* This one shows only on screens ≥ 640px (sm) */}
                      <FaExchangeAlt className="hidden sm:block h-6 w-6 text-white" />

                      {/* This one shows only on screens < 640px */}
                      <CgArrowsExchangeAltV className="block sm:hidden h-6 w-6 text-white" />

                    </button>
                  </div>
                </div>

                {/* Computer Card */}
                <Player player={opponentUser?.user?.username || "Player O"} symbol={opponentUser?.symbol || "O"} />
              </div>

              {/* Start Button */}
              <button onClick={handleStartGame}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-12 rounded-lg shadow-lg transition">
                Start
              </button>
            </div>
          </>
        )}
        {((mode === 'Custom' && player?.username.length > 0 && playerState.length > 0) && !startPlay) && (
          <>
            <div className="bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl p-8 w-80 text-center text-white shadow-lg select-none">
              <h2 className="text-2xl font-extrabold mb-6">Custom Board</h2>
              {/* Board Size */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={() => {
                    const newSize = Math.max(3, customSize - 1);
                    if (newSize < customWin) {
                      setCustomWin(newSize);
                    }
                    setCustomSize(newSize);
                  }}
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                  aria-label="Decrease board size"
                >
                  <FiMinus size={20} />
                </button>
                <div className="bg-blue-300 rounded-lg px-3 py-1 text-blue-900 font-bold text-2xl select-text">
                  {customSize} x {customSize} size
                </div>
                <button
                  onClick={() => setCustomSize(Math.min(8, customSize + 1))}
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                  aria-label="Increase board size"
                >
                  <FiPlus size={20} />
                </button>
              </div>
              {/* Win Condition */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={() => setCustomWin(Math.max(3, customWin - 1))}
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                  aria-label="Decrease win condition"
                >
                  <FiMinus size={20} />
                </button>
                <div className="bg-blue-300 rounded-lg px-8 py-1 text-blue-900 font-bold text-2xl select-text">
                  {customWin} win
                </div>
                <button
                  onClick={() => setCustomWin(Math.min(5, customSize, customWin + 1))}
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                  aria-label="Increase win condition"
                >
                  <FiPlus size={20} />
                </button>
              </div>
              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="bg-blue-900 hover:bg-blue-800 text-white cursor-pointer font-semibold py-3 px-12 rounded-lg shadow-lg transition">
                Start
              </button>
            </div>
          </>
        )}
        {playerState === 'online' && isPlayingWith === 'friends' && !startPlay && (
          <LudoLobby />
        )}
        {(startPlay) && (
          <>
            <TicTacToe />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
