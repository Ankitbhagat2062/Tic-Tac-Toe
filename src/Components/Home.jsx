import { useEffect, useState } from "react";
import { FiPlus, FiMinus, } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdBrush } from "react-icons/io";
import { FaBookOpen, FaChild, FaExchangeAlt } from "react-icons/fa";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { useShallow } from 'zustand/shallow';

import useAuthStore from "../store/useAuthStore";
import { initializeSocket, disconnectSocket } from '../services/socketService';
import useApp from '../hooks/useApp';
import TicTacToe from "./TicTacToe";
import Navbar from "./Navbar";

import useOnlinePlayStore from "../store/onlinePlayStore";
import { Player, SettingsButton } from './icons'
import LudoLobby from "./LudoLobby";
import { shadow } from "../css/colors";

const Home = () => {
  const { token, } = useApp();

  const playerSymbol = useOnlinePlayStore((state) => state.playerSymbol);
  const { initsocketListeners, cleanup } = useOnlinePlayStore();

  const { fetchUser, user } = useAuthStore();

  const { setPlayer, setOpponentUser, setStartPlay, setMode, setPlayerState, setCustomWin, setCustomSize, setBoardState } = useOnlinePlayStore(
    useShallow((state) => ({
      setPlayer: state.setPlayer,
      setOpponentUser: state.setOpponentUser,
      setStartPlay: state.setStartPlay,
      setMode: state.setMode,
      setPlayerState: state.setPlayerState,
      setCustomWin: state.setCustomWin,
      setCustomSize: state.setCustomSize,
      setBoardState: state.setBoardState,
    })));


  // Redux state selectors
  const player = useOnlinePlayStore((state) => state.player)
  const startPlay = useOnlinePlayStore((state) => state.startPlay);
  const customWin = useOnlinePlayStore((state) => state.customWin);
  const customSize = useOnlinePlayStore((state) => state.customSize);
  const mode = useOnlinePlayStore((state) => state.mode);
  const playerState = useOnlinePlayStore((state) => state.playerState)
  const opponentSymbol = useOnlinePlayStore((state) => state.opponentSymbol)
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser)
  const { timer } = useOnlinePlayStore();
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

  const [progress, setProgress] = useState(0);
  const { startTimer , showSetting, setShowSetting } = useOnlinePlayStore();

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
  useEffect(() => {
    console.log(playerState , opponentUser , player , mode , startPlay , timer)
  }, [player , mode , playerState , opponentUser , startPlay , timer]);
  return (
    <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] font-[Arial,sans-serif] 
  relative min-h-screen box-border flex flex-col items-center justify-center text-white overflow-hidden">

      {/* Header with Settings */}
      <AnimatePresence>
        <motion.div className={`fixed top-0 z-20 w-full`}>
          <Navbar />
        </motion.div>
      </AnimatePresence>
      <div onClick={() => setShowSetting(!showSetting)} className={`${shadow} overflow-hidden`}>
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
      {(player.length === 0 && mode.length === 0) && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 max-w-4xl mx-auto">
          <motion.div
            className="relative cursor-pointer group hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setPlayerState("online");
              setPlayer(user.username);
            }}
          >
            <img
              src="/images/Play_Online.png"
              alt="Online Multiplayer"
              className="w-full h-full object-cover"
              width={64}
            />
          </motion.div>

          <motion.div
            className="relative cursor-pointer rounded-2xl w-full overflow-hidden group hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setPlayerState("offline");
              setOpponentUser({
                username: "AI",
                profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKcsVMR5kXAqIxXZyDvqymKfKOKFPhBjr3u9caGp1HmqtuGvQ=s96-c",
              });
              setPlayer(user.username)
            }}
          >
            <img
              src="/images/Play_With_Computer.png"
              alt="VS Computer"
              className="w-full object-cover block"
              width={64}
            />
          </motion.div>
          <motion.div
            className="relative cursor-pointer items-center justify-center flex rounded-2xl w-full group hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setPlayerState("offline");
              setOpponentUser({
                username: "Player 2",
                profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKcsVMR5kXAqIxXZyDvqymKfKOKFPhBjr3u9caGp1HmqtuGvQ=s96-c",
              });
              setPlayer(user.username)
            }}
          >
            <div className={`relative p-1 border-4 border-[#6e63c4]  w-64 h-auto bg-yellow-500 rounded-2xl shadow-lg ${shadow}`}>
              {/* Blue top section */}
              <div className="relative rounded-t-2xl h-28 bg-blue-700 flex items-center justify-center p-4">
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
                  <FaChild size={50} color="yellow" />
                </div>
                <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2">
                  <FaBookOpen size={50} color="yellow" />
                </div>
                {/* You can add a subtle diamond shape in the middle if desired, similar to Ludo King */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 bg-yellow-400"></div>
              </div>

              {/* Yellow bottom section with text */}
              <div className="flex items-center justify-center py-4 px-2">
                <span className="text-blue-800 text-3xl font-bold uppercase tracking-wide">
                  Pass N Play
                </span>
              </div>
            </div>
          </motion.div>
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
              <div
                key={i}
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
      {(mode === 'Classic' && player.length > 0 && playerState.length > 0 && !startPlay) && (
        <>
          <div className="flex flex-col items-center space-y-8">
            <div className="flex items-center sm:space-x-12 flex-col sm:flex-row sm:mt-0 mt-10">
              {/* Player 1 Card */}
              <Player player={player || "Player X"} symbol={playerSymbol || "X"} />
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
              <Player player={opponentUser.username || "Player O"} symbol={opponentSymbol || "O"} />
            </div>

            {/* Start Button */}
            <button onClick={handleStartGame}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-12 rounded-lg shadow-lg transition">
              Start
            </button>
          </div>
        </>
      )}
      {(mode === 'Custom' && player.length > 0 && playerState.length > 0 && !startPlay) && (
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
      {playerState === 'online' && !startPlay && (
        <LudoLobby />
      )}
      {(startPlay) && (
        <>
          <TicTacToe />
        </>
      )}
    </div>
  );
};

export default Home;
