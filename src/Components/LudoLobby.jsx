import React, { useCallback, useState } from 'react';
import { FaCheck, FaCoins, FaMinus, FaPlus, FaCheckCircle, FaRegCircle, FaMapPin, FaForward, FaAward, FaShareAlt, FaWhatsapp } from 'react-icons/fa'; // For coins and diamonds (FaGem as alternative to GiDiamond if needed)
import { FiHelpCircle, FiShare2, FiGift } from 'react-icons/fi';
import { TbArrowBackUp } from "react-icons/tb";
import { toast } from 'react-toastify'

import '../App.css';
import { shadow } from "../css/colors";
import useAuthStore from "../store/useAuthStore";
import useOnlinePlayStore from "../store/onlinePlayStore";
import Loader from '../Assets/Loader';
import { SelectGame, SelectIcon, TotalCash, VoiceIcon } from './icons';
const LudoLobby = () => {
  const [isRoomCreated, setIsRoomCreated] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const {
    numPlayers,
    voiceChat,
    entryAmount,
    totalCoins,
    diamonds,
    dailyFree,
    step,
    selectedGame,

    setNumPlayers,
    setRoomId,
    setVoiceChat,
    setEntryAmount,
    setStep,
    spendCoins,
    setCustomSize,
    setStartPlay,
    startTimer,
  } = useOnlinePlayStore();

  const { user } = useAuthStore();
  const roomId = useOnlinePlayStore((state) => state.roomId);
  const status = useOnlinePlayStore((state) => state.status);
  const error = useOnlinePlayStore((state) => state.error);
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser)
  const { createRoom, joinRoom , cleanup} = useOnlinePlayStore();

  React.useEffect(() => {
    if (status === "Room not found" && !isRoomCreated) {
      setStep(0);
      setRoomId('');
      toast(status);
    }
  }, [status, isRoomCreated, setStep, setRoomId]);

  const handleCreate = () => {
    createRoom("online", user);
    setStep(2);
    spendCoins(entryAmount)
  };

  const handleJoin = () => {
    if (!roomId) {
      toast.info('Please enter private code');
      return;
    }
    // TODO: Implement join logic
    setStep(2);
    setIsLoading(true);
    spendCoins(entryAmount);
    if (!isRoomCreated) joinRoom(roomId, user);
  };

  const handleStartGame = useCallback(() => {
    setStartPlay(true)
    startTimer();
  }, [setStartPlay, startTimer])
  React.useEffect(() => {
    const bothReady =
      opponentUser?.user?.profilePicture &&
      opponentUser?.user?.username &&
      user?.profilePicture &&
      user?.username;

    if (bothReady) {
      handleStartGame();
      setIsLoading(true);
    }
  }, [opponentUser, user, handleStartGame]);
  return (
    <>
    {error && <Loader/>}
    <div className={`${step === 2 ? 'bg-red-600' : 'bg-[#000000de]'} z-101 min-h-screen text-white font-sans 
    absolute top-1 flex flex-col items-center justify-start px-4 w-full overflow-hidden`}>
      {/* Background elements if needed */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Add subtle patterns if desired */}
      </div>
      {step !== 2 && (
        <>
          {/* Top Bar: Coins, Diamonds, Game History */}
           <TotalCash totalCoins={totalCoins} diamonds={diamonds} />

          {/*  Toggle: Create | Join */}
          <div className="flex space-x-4 mb-3">
            <button
              onClick={() => setIsRoomCreated(true)}
              className={`px-6 py-1 rounded-full font-bold transition text-yellow-400 cursor-pointer ${isRoomCreated
                ? 'border-yellow-500 bg-blue-700 border-2'
                : 'border-yellow-500/35 bg-blue-700/35 text-black shadow-lg border-2'
                }`}
            >
              Create
            </button>
            {(step === 0) && (
              <button
                onClick={() => setIsRoomCreated(false)}
                className={`px-6 py-1 rounded-full font-bold transition text-yellow-400 cursor-pointer ${!isRoomCreated
                  ? 'bg-blue-700 border-yellow-500  border-2'
                  : 'border-yellow-500/35 bg-blue-700/35 text-black shadow-lg border-2'
                  }`}
              >
                Join
              </button>
            )}
          </div>
        </>
      )}

      <div className="absolute top-0 left-0 bg-blue-500">
        <button onClick={() => {
          if (step === 2) {
            setStep(1);
          } else if (step === 1) {
            setStep(0);
          } else if (step === 0){
            cleanup();
          }
        }}>
          <TbArrowBackUp className='h-8 w-8 text-yellow-500' />
        </button>
      </div>

      {(isRoomCreated && step === 0) && (
        <>
          {/* Select Board */}
          <div className="w-full max-w-md mb-3 bg-blue-800 py-4 border-2 border-yellow-300">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-500">Select Board</h2>
            <div className="flex justify-around">
              {[3, 4, 5].map((players) => (
                <button
                  key={players}
                  onClick={() => {
                    setNumPlayers(players);
                    setCustomSize(players);
                  }}
                  className={`relative p-2 rounded-lg transition ${numPlayers === players
                    ? 'bg-blue-700 shadow-lg scale-105 border-yellow-300 border-2'
                    : 'bg-gray-700 hover:bg-gray-600 border-white/50 border-2'
                    }`}
                >
                  <img
                    src="/images/tic-tac-toe.png"
                    alt={`${players} players`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="absolute bottom-2 right-2 bg-white text-black text-[8px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {players}X{players}
                  </div>
                  {numPlayers === players && <FaCheckCircle className="absolute -top-1 -right-2 w-8 h-8 rounded-full text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Create Lobby / Join (but since create, show Create Lobby) */}
          <div className="bg-blue-800 outline-2 outline-yellow-300 p-4 w-full max-w-md mb-1 text-center">
            <h3 className="font-bold mb-2 text-yellow-400">Select Lobby</h3>
            {/* Toggles: Voice Chat, Chat */}
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setVoiceChat(!voiceChat)}
                className="relative flex items-center pl-8 pr-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md"
              >
                {/* Left golden ring */}
                <span className="absolute -left-3 flex items-center justify-center w-10 h-10 rounded-full border-4 border-yellow-400 bg-blue-900">
                  {voiceChat && (
                    <FaCheck className='text-white w-8 h-8' />
                  )}
                </span>

                {/* Text */}
                <span className="ml-4">Voice Chat</span>

                {/* Right green bubble with mic */}
                 <VoiceIcon />
              </button>
            </div>
            <div className="line w-full bg-amber-100 h-1 mb-2"></div>
            {/* Entry Fee */}
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
            {/* Next Button */}
            <button onClick={() => setStep(1)}
              className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
               hover:scale-105 transition mb-4 ${shadow}`}>
              Next
            </button>
          </div>
        </>
      )}
      {((!isRoomCreated && step !== 2) || step === 1) && (
        <>
          {/* Select Token / Color */}
          <SelectIcon />
        </>
      )}
      {(step === 1) && (
        <>
          {/* Select Game */}
          <SelectGame />

          {/* Create Room Button */}
          <div className="bg-blue-800 border-2 border-yellow-300 rounded-xl p-4 w-full max-w-md mb-4 text-center">
            <button onClick={() => handleCreate()}
              className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 w-full border-2 border-yellow-500 mb-2">
              Create Room
            </button>
            {/* Daily Free */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="font-bold text-gray-400">Daily Free: 0/{dailyFree}</span>
            </div>
          </div>
        </>
      )}
      {(!isRoomCreated && step === 0) && (
        <>
          {/* Join  */}
          <div className="bg-blue-800 border-2 border-amber-300 rounded-xl p-4 w-full max-w-md mb-1 text-center">
            <h3 className="font-bold mb-4">Enter Private Room Code</h3>
            <p className="font-bold text-red-600 mb-4">{(error)&& error}</p>
            {/* Enter Private Code */}
            <input type="text" placeholder="Enter private code here..." value={roomId} required onChange={(e) => setRoomId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white text-black mb-4 text-center"/>
            <button
              onClick={handleJoin} disabled={isLoading}
              className="bg-yellow-500 cursor-pointer text-black font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition w-full"
            >
             {isLoading ? 'Loading' : 'Join Room'}
            </button>
            {/* Daily Free */}
            <div className="flex items-center justify-center space-x-2 text-sm mb-1">
              <span className='font-bold text-gray-400/35'>Daily Free: 0/{dailyFree}</span>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <div className="w-full max-w-md flex flex-col items-center p-5">
          {/* Header */}
          <div className="w-full text-center py-3 mb-4">
            <h1 className="text-2xl font-extrabold text-yellow-400">ONLINE MULTIPLAYER</h1>
          </div>

          {/* Room Info Share */}
          <div className="rounded-lg p-3 mb-4 w-3/4 border-2 border-white text-center flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-between gap-1 w-full">
              <h2 className="text-white font-bold sm:text-2xl text-sm">Room Code : <span className='bg-blue-500 text-yellow-400 px-2 rounded-lg'>{roomId}</span> </h2>
              <button className='bg-blue-500 rounded-xl p-1 outline-1 outline-yellow-300'>
                <FaShareAlt className="text-yellow-400" />
              </button>
            </div>
            <div className="flex items-start justify-between gap-1 w-full">
              <p className='text-sm text-center'>Share this room code with friends and ask them to join</p>
              <button>
                <FaWhatsapp className={`w-6 h-6 rounded-lg text-white bg-green-400`} />
              </button>
            </div>
          </div>

          {/* Your Entry Amount */}
          <div className="flex items-center justify-center space-x-3 mb-4 w-full">
            <div className="text-green-400 px-4 py-2 rounded-full font-bold">
              {selectedGame.charAt(0).toUpperCase() + selectedGame.slice(1)} {'>'} Entry Amount {'>'} ₹{entryAmount}
            </div>
          </div>

          {/* Players Section */}
          <div className="flex  flex-col items-center justify-between w-full mb-6">
            {/* User Profile */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={user?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-red-500 object-cover"
                />
                {/* Username below profile */}
                <span className="text-white font-bold mt-2 text-center block">
                  {user?.username || 'Player 1'}
                </span>
              </div>
            </div>

            {/* VS */}
            <span className="text-green-500 text-3xl font-bold mx-4 [text-shadow:0_0_5px_currentColor,0_0_10px_currentColor,0_0_20px_rgba(255,0,0,0.5)] animate-pulse">VS</span>

            <div className={`flex ${opponentUser?.user?.profilePicture ? 'flex-col' : 'flex-row'} justify-center gap-1 items-center`}>
              {[1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className={`${opponentUser?.user?.username ? `relative ${slot !== 1 && 'hidden'}` : 'w-16 h-16 relative bg-red-500 rounded-lg flex items-center justify-center border-2 border-white'}`}
                >
                  {/* brightness-110 invert grayscale contrast-[999] mix-blend-multiply bg-transparent */}
                  {(opponentUser?.user?.profilePicture) && (
                    <img
                      src={opponentUser?.user?.profilePicture || '/images/player.png'}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-red-500 object-cover"
                    />
                  )}
                  {!opponentUser?.user?.profilePicture && isRoomCreated && (
                    <p></p>
                  )}
                  {!opponentUser?.user.profilePicture && (<img
                    src={'./images/player.png'}
                    alt="Profile"
                    className={` rounded-full object-cover w-12 h-12 text-white`}
                  />)}
                  <div className={`${opponentUser?.user?.profilePicture ? 'text-white font-bold mt-2 text-center block' : 'absolute bottom-3 right-3 border-3 border-[#00000000]/25 flex items-center justify-center bg-white text-black w-4 h-4 rounded-full'}`}>
                    {opponentUser?.user?.username || '+'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Ready Button */}
          <button disabled={!isLoading} onClick={() => handleStartGame()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition duration-300 shadow-lg">
           {isLoading ?' Ready to Play' : 'Loading'}
          </button>
        </div>
      )}
      {step !== 2 && (
        <>
          {/* Bottom Icons: How to Play, Social */}
          <div className="flex justify-center space-x-6 mt-auto pb-4">
            <FiHelpCircle className="text-2xl hover:scale-110 transition cursor-pointer" title="How to Play" />
            <FiShare2 className="text-2xl hover:scale-110 transition cursor-pointer" title="Share" />
            <FiGift className="text-2xl hover:scale-110 transition cursor-pointer" title="Daily" />
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default LudoLobby;
