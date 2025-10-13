import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaChild } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { useShallow } from 'zustand/shallow';

import { initializeSocket, disconnectSocket } from '../services/socketService';
import useOnlinePlayStore from "../store/onlinePlayStore";
import useAuthStore from "../store/useAuthStore";
import useApp from '../hooks/useApp';
import Navbar from "../Components/Navbar";
import TicTacToe from "../Components/TicTacToe";
import LudoLobby from "./LudoLobby";
import { shadow } from "../Assets/colors";
import { SearchUser, SelectGame, SelectIcon, SettingsButton, TotalCash, EntryFee, SelectPlayers, ArrowBack, SelectName } from '../Assets/Component'

const Home = () => {
  const { token, } = useApp();
  const { initsocketListeners, cleanup, socket } = useOnlinePlayStore();
  const { fetchUser, user } = useAuthStore();

  // const playerSymbol = useOnlinePlayStore((state) => state.playerSymbol);
  const isPlayingWith = useOnlinePlayStore((state) => state.isPlayingWith)
  const player = useOnlinePlayStore((state) => state.player)
  const startPlay = useOnlinePlayStore((state) => state.startPlay);
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser);
  const customSize = useOnlinePlayStore((state) => state.customSize);
  const mode = useOnlinePlayStore((state) => state.mode);
  const playerState = useOnlinePlayStore((state) => state.playerState)
  const onlineUsers = useOnlinePlayStore((state) => state.onlineUsers)
  const totalCoins = useOnlinePlayStore((state) => state.totalCoins)
  const diamonds = useOnlinePlayStore((state) => state.diamonds)
  const selectedPlayers = useOnlinePlayStore((state) => state.selectedPlayers)
  const selectedIcon = useOnlinePlayStore((state) => state.selectedIcon)
  const selectedColor = useOnlinePlayStore((state) => state.selectedColor)
  const { startTimer, showSetting, setShowSetting, setEntryAmount, entryAmount, step, setStep } = useOnlinePlayStore();
  const { setIsPlayingWith, setPlayer, setOpponentUser, setStartPlay, setPlayerState, setSelectedPlayers, setBoardState , setCurrentPlayer} = useOnlinePlayStore(
    useShallow((state) => ({
      setIsPlayingWith: state.setIsPlayingWith,
      setPlayer: state.setPlayer,
      setOpponentUser: state.setOpponentUser,
      setStartPlay: state.setStartPlay,
      setPlayerState: state.setPlayerState,
      setSelectedPlayers: state.setSelectedPlayers,
      setBoardState: state.setBoardState,
      setCurrentPlayer: state.setCurrentPlayer,
    })));

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  const handleStartGame = () => {
    if (!startPlay) {
      setCurrentPlayer(player.user.username);
      setStartPlay(true);
      setBoardState(Array(customSize * customSize).fill(null));
      startTimer();
    }
  }
  useEffect(() => {
    if (isPlayingWith === 'randomUser' && step === 2) socket.emit("user_connected", user);
  }, [socket, user, isPlayingWith, step]);

  console.assert(motion)
  return (
    <>
      <ToastContainer />
      <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] opacity-70 fixed inset-0 z-[-1]"></div>
      <div className=" font-[Arial,sans-serif]
  relative min-h-screen box-border flex flex-col items-center justify-center text-white overflow-hidden">

        {/* Header with Settings */}
        <AnimatePresence>
          <motion.div className={`fixed top-0 z-20 w-full`}>
            <Navbar />
          </motion.div>
        </AnimatePresence>
        {showSetting && (
          <>
            <div onClick={() => {
              setShowSetting(!showSetting);
            }} className={`${shadow} overflow-hidden`}>
              <img src="./settings.gif" alt="Setting" className="brightness-110 w-8 h-8 grayscale contrast-[999] mix-blend-multiply bg-transparent" />
            </div>
            <SettingsButton />
          </>
        )}
        {/* Floating animated dots background */}
        <div className="fixed inset-0 opacity-20 pointer-events-none -z-10">
          <div className="w-full h-full animate-[moveDots_10s_linear_infinite] bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        {(Object.keys(player).length === 0 && mode.length === 0) && (
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
                setOpponentUser({ user: { username: "AI", profilePicture: "", }, symbol: { id: '0', color: {id:'blue',bg:'bg-blue-500',border:'border-blue-500'}} });
                setIsPlayingWith("AI");
                setPlayer({ user, symbol: { id:selectedIcon?.id, color: selectedColor } });
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
                setIsPlayingWith('Human');
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
        {playerState === 'offline' && !startPlay && (
          <>
            <div className={`bg-[#000000de] z-101 min-h-screen text-white font-sans 
      absolute top-1 flex flex-col items-center justify-start px-4 w-full overflow-hidden`}>
              <ArrowBack />
              <div className={`w-full flex items-center justify-center`}>
                <TotalCash totalCoins={totalCoins} diamonds={diamonds} />
              </div>
              {isPlayingWith === 'AI' ? (
                <>
                  {step === 0 &&
                    <>
                      <SelectGame games={['Classic', 'Rush Mode']} />
                      <button onClick={() => setStep(1)}
                        className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                               hover:scale-105 transition mb-4 ${shadow}`}>
                        Next
                      </button>
                    </>
                  }
                  {step === 1 &&
                    <>
                      <SelectIcon />
                      {mode === 'Classic' && <SelectPlayers enabled={[2, 3, 4, 5]} disabled={[2, 3]} button={'Players'} shadow={'border-4 border-yellow-400 shadow-[0_0_15px_5px_rgba(255,215,0,0.7)] py-2.5 px-5'} selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} />}
                      <button onClick={() => handleStartGame()}
                        className={`my-5 bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                               hover:scale-105 transition mb-4 ${shadow}`}>
                        Play
                      </button>
                    </>
                  }
                </>
              ) : (
                <div className="max-w-md text-center flex flex-col items-center justify-center">
                  {step === 0 && (
                    <div className="step1 w-full items-center justify-center">
                      <div className={`flex items-center justify-center flex-col`}>
                        <SelectIcon />
                        <SelectGame games={['Classic', 'Quick']} />
                        {/* Next Button */}
                        <button onClick={() => setStep(1)}
                          className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition mb-4 ${shadow}`}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <>
                      <SelectName handleStartGame={handleStartGame}/>
                      <button
                        className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition my-4 ${shadow}`}>
                         Play - One Token Out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {playerState === 'online' && !startPlay && (
          <>
            <div className={`${step === 2 ? 'bg-[#d62a30e0]' : 'bg-[#000000de]'} z-101 min-h-screen text-white font-sans 
    absolute top-1 flex flex-col items-center justify-start px-4 w-full overflow-hidden`}>
              <ArrowBack />
              <div className={`w-full flex items-center justify-center`}>
                <TotalCash totalCoins={totalCoins} diamonds={diamonds} />
              </div>

              {isPlayingWith === 'randomUser' ? (
                <>
                  {step === 0 && (
                    <div className="step1 w-full items-center justify-center">
                      <div className={`flex items-center justify-center flex-col`}>
                        <SelectGame games={['Quick', 'Classic', 'Popular', 'Mask Mode']} />
                        {/* Next Button */}
                        <button onClick={() => setStep(1)}
                          className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition mb-4 ${shadow}`}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="step2 flex flex-col w-full max-w-md items-center justify-center">
                      <SelectIcon />
                      <EntryFee entryAmount={entryAmount} setEntryAmount={setEntryAmount} className={'shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]'} />
                      <button onClick={() => {
                        setStep(2);
                        setPlayer({ user, symbol: { id: selectedIcon?.id, color: selectedColor } });
                      }}
                        className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
                           hover:scale-105 transition mb-4 ${shadow}`}>
                        Next
                      </button>
                    </div>
                  )}
                  {step === 2 && (
                    <>
                      <div className="w-full max-w-md flex flex-col items-center p-5">
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
                          <SearchUser user={user} onlineUser={onlineUsers} />
                        </div>

                        {/* Bottom Ready Button */}
                        <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition duration-300 shadow-lg">
                          Ready to Play
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <LudoLobby />
              )}
            </div>
          </>
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
