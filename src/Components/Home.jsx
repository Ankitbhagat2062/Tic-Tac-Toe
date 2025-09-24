import { useEffect, useState } from "react";
import { FiSettings, FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, MenuItems, Menu, MenuButton } from '@headlessui/react';
import { Link } from "react-router-dom";
import { IoMdBrush } from "react-icons/io";
import { FaExchangeAlt } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { CgArrowsExchangeAltV } from "react-icons/cg";

import useAuthStore from "../store/useAuthStore";
import { initializeSocket, disconnectSocket } from '../services/socketService';
import useApp from '../hooks/useApp';
import TicTacToe from "./TicTacToe";
import Navbar from "./Navbar";

import {
  setPlayer,
  setStartPlay,
  setMode,
  setPlayerState,

  setCustomWin,
  setCustomSize,
} from '../store/gameSlice';

import useOnlinePlayStore from "../store/onlinePlayStore";

const Home = () => {
  const { token, } = useApp();

  const playerSymbol = useOnlinePlayStore((state) => state.playerSymbol);
  const currentPlayer = useOnlinePlayStore((state) => state.currentPlayer);
  const { initsocketListeners, cleanup } = useOnlinePlayStore();

  const { fetchUser, fetchUserProfile } = useAuthStore();

  // Redux state selectors
  const player = useSelector((state) => state.game.player)
  const startPlay = useSelector((state) => state.game.startPlay);
  const customWin = useSelector((state) => state.game.customWin);
  const customSize = useSelector((state) => state.game.customSize);
  const mode = useSelector((state) => state.game.mode)
  const playerState = useSelector((state) => state.game.playerState)

  // Redux dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    fetchUser();
    fetchUserProfile();
  }, [token, fetchUser, fetchUserProfile]);

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

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 10); // ~4s
    return () => clearInterval(timer);
  }, []);
  const Player = ({ player, symbol }) => {
    return (
      <>
        <div className="flex flex-col items-center justify-center bg-blue-700 rounded-lg p-6 w-32 h-40 shadow-lg">
          <div className="w-16 h-20 flex items-center justify-center bg-blue-900 rounded-md mb-2">
            <span className="text-6xl text-cyan-400 font-extrabold">{symbol}</span>
          </div>
          <span className="text-white font-semibold text-lg">{player}</span>
        </div>
      </>
    )
  }
  const handleSelectGame = (selectedMode) => {
    if (selectedMode === 'Classic') {
      if (mode.length === 0) {
        dispatch(setMode("Classic"));
      }
      else {
        dispatch(setPlayerState("offline"));
        dispatch(setPlayer("AI"));
      };
      if (player.length > 0) {
        dispatch(setPlayer("Player 2"));
      }

    } else if (selectedMode === 'Custom') {
      if (mode.length === 0) {
        dispatch(setMode("Custom"))
      }
      else {
        dispatch(setPlayer("Player 1"));
      };
      if (player.length > 0) {
        dispatch(setPlayerState("online"));
      }
    }
  }
  const Button = ({ selectedMode }) => {
    if (mode.length === 0) {
      return <span>{selectedMode}</span>
    }
    else if (mode.length > 0 && selectedMode === 'Classic') {
      if (player.length === 0) return <span>AI</span>
      if (player.length > 0) return <span>Offline</span>
    } else if (mode.length > 0 && selectedMode === 'Custom') {
      if (player.length === 0) return <span>Player</span>
      if (player.length > 0) return <span>Online</span>
    }
  }
  return (
    <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] font-[Arial,sans-serif] 
  relative min-h-screen box-border flex flex-col items-center justify-center text-white overflow-hidden">

      {/* Header with Settings */}
      <AnimatePresence>
        <motion.div className={`${startPlay ? 'sticky ' : 'fixed '} top-0 z-20 w-full`}>
          <Navbar />
        </motion.div>
      </AnimatePresence>

      {/* Floating animated dots background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none -z-10">
        <div className="dots"></div>
      </div>

      {((playerState.length === 0 && player !== 'AI') && !startPlay) && (
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
                    <Button selectedMode={"Classic"} />
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
                    <Button selectedMode={"Custom"} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )
      }
      {(mode === 'Classic' && player.length > 0 && playerState.length > 0 && !startPlay) && (
        <>
          <div className="flex flex-col items-center space-y-8">
            <div className="flex items-center sm:space-x-12 flex-col sm:flex-row sm:mt-0 mt-10">
              {/* Player 1 Card */}
              <Player player={"Player 1"} symbol={"O"} />
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
              <Player player={player} symbol={"X"} />
            </div>

            {/* Start Button */}
            <button onClick={() => {
              if (!startPlay) {
                dispatch(setStartPlay(!startPlay));
              }
            }}
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
                onClick={() => dispatch(setCustomSize(Math.max(3, customSize - 1)))}
                className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                aria-label="Decrease board size"
              >
                <FiMinus size={20} />
              </button>
              <div className="bg-blue-300 rounded-lg px-3 py-1 text-blue-900 font-bold text-2xl select-text">
                {customSize} x {customSize} size
              </div>
              <button
                onClick={() => dispatch(setCustomSize(Math.min(8, customSize + 1)))}
                className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                aria-label="Increase board size"
              >
                <FiPlus size={20} />
              </button>
            </div>
            {/* Win Condition */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => dispatch(setCustomWin(Math.max(3, customWin - 1)))}
                className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                aria-label="Decrease win condition"
              >
                <FiMinus size={20} />
              </button>
              <div className="bg-blue-300 rounded-lg px-8 py-1 text-blue-900 font-bold text-2xl select-text">
                {customWin} win
              </div>
              <button
                onClick={() => dispatch(setCustomWin(Math.min(5, customWin + 1)))}
                className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 shadow-md transition"
                aria-label="Increase win condition"
              >
                <FiPlus size={20} />
              </button>
            </div>
            {/* Start Button */}
            <button
              onClick={() => {
                if (!startPlay) {
                  dispatch(setStartPlay(!startPlay));
                }
              }}
              className="bg-blue-900 hover:bg-blue-800 text-white cursor-pointer font-semibold py-3 px-12 rounded-lg shadow-lg transition"
            >
              Start
            </button>
          </div>
        </>
      )}
      {(startPlay && mode === 'Classic') && (
        <>
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center gap-6 w-full h-full md:gap-12">
            <h1>{mode} Game Started</h1>

            {/* Layout wrapper */}
            <div className="flex flex-col items-center justify-center gap-6 w-full h-full md:flex-row md:gap-12">
              {/* Players Row - top on mobile, split on desktop */}
              <div className="flex flex-row items-start justify-center gap-6 md:flex-col md:flex-[1]">
                {/* Player 1 */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <Player player="Player 1" symbol="X" className="w-20 h-24 md:w-28 md:h-32 lg:w-36 lg:h-40" />
                  <h1 className="text-sm md:text-base lg:text-lg text-center">
                    {(playerSymbol === currentPlayer && currentPlayer) && `Your Turn ${currentPlayer}`}
                  </h1>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <Player player={player} symbol="O" className="w-20 h-24 md:w-28 md:h-32 lg:w-36 lg:h-40" />
                </div>
              </div>

              {/* Board - bottom on mobile, middle on desktop */}
              <div className="order-2 md:order-none flex-[9] flex items-center justify-center">
                <div className="w-full aspect-square max-w-[500px]">
                  <TicTacToe />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {(startPlay && mode === 'Custom') && (
        <>
           {/* Main Content */}
          <div className="flex flex-col items-center justify-center gap-6 w-full h-full md:gap-12">
            <h1>{mode} Game Started</h1>

            {/* Layout wrapper */}
            <div className="flex flex-col items-center justify-center gap-6 w-full h-full md:flex-row md:gap-12">
              {/* Players Row - top on mobile, split on desktop */}
              <div className="flex flex-row items-start justify-center gap-6 md:flex-col md:flex-[1]">
                {/* Player 1 */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <Player player="Player 1" symbol="X" className="w-20 h-24 md:w-28 md:h-32 lg:w-36 lg:h-40" />
                  <h1 className="text-sm md:text-base lg:text-lg text-center">
                    {playerSymbol === currentPlayer && `Your Turn ${currentPlayer}`}
                  </h1>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <Player player={player} symbol="O" className="w-20 h-24 md:w-28 md:h-32 lg:w-36 lg:h-40" />
                </div>
              </div>

              {/* Board - bottom on mobile, middle on desktop */}
              <div className="order-2 md:order-none flex-[9] flex items-center justify-center">
                <div className="w-full aspect-square max-w-[500px]">
                  <TicTacToe />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
