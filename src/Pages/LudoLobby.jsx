import React, { useCallback, useEffect, useState } from 'react';
import { FaCheck, FaCheckCircle, FaShareAlt, FaWhatsapp, FaCaretLeft, FaCaretRight } from 'react-icons/fa'; // For coins and diamonds (FaGem as alternative to GiDiamond if needed)
import { FiHelpCircle, FiShare2, FiGift } from 'react-icons/fi';
import { IoIosLock } from 'react-icons/io';
import { toast } from 'react-toastify'

import '../App.css';
// import { shadow } from "../Assets/colors";
import useAuthStore from "../store/useAuthStore";
import useOnlinePlayStore from "../store/onlinePlayStore";
import { EntryFee, SelectGame, SelectIcon, SelectPlayers, TotalCash, } from '../Assets/Component';
import { VoiceIcon } from '../Assets/react-icons';
import { board, shadow } from '../Assets/colors';

const LudoLobby = () => {
  const [isRoomCreated, setIsRoomCreated] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const {
    voiceChat,
    entryAmount,
    dailyFree,
    step,
    selectedGame,

    setRoomId,
    setVoiceChat,
    setEntryAmount,
    setStep,
    spendCoins,
    setCustomSize,
    customSize,
    setStartPlay,
    startTimer,
    setCustomWin
  } = useOnlinePlayStore();
  const { user } = useAuthStore();
  const { createRoom, joinRoom } = useOnlinePlayStore();
  const roomId = useOnlinePlayStore((state) => state.roomId);
  const status = useOnlinePlayStore((state) => state.status);
  const error = useOnlinePlayStore((state) => state.error);
  const selectedIcon = useOnlinePlayStore((state) => state.selectedIcon);
  const selectedColor = useOnlinePlayStore((state) => state.selectedColor);
  const setPlayer = useOnlinePlayStore((state) => state.setPlayer);
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser)
  const customWin = useOnlinePlayStore((state) => state.customWin);
  React.useEffect(() => {
    if (status === "Room not found" && !isRoomCreated) {
      setStep(0);
      setRoomId('');
      toast(status);
    }
  }, [status, isRoomCreated, setStep, setRoomId]);
  useEffect(() => {
    setPlayer({ user: user,symbol:{ id: selectedIcon.id,color:selectedColor} });
  }, [selectedColor ,selectedIcon , setPlayer , user])
  

  const handleCreate = () => {
    createRoom("online", "");
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
    if (!isRoomCreated) joinRoom(roomId);
  };

  const { currentIndex, setCurrentIndex, } = useOnlinePlayStore();
  const handleLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleRight = () => {
    setCurrentIndex(prev => Math.min(board.length - 4, prev + 1));
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
  const enabled = customSize === 4 ? [3, 4] : [3, 4, 5]
  return (
    <>
      {/* Background elements if needed */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Add subtle patterns if desired */}
      </div>
      {step !== 2 && (
        <>
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
      {(isRoomCreated && step === 0) && (
        <>
          {/* Select Board */}
          <div className="w-full max-w-md mb-3 bg-blue-900 py-4 border-4 border-yellow-300 shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]">
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-500">Select Board</h2>
            <div className="flex items-center justify-center">
              <button
                onClick={handleLeft}
                className={`flex-shrink-0 mr-4 p-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={currentIndex === 0}>
                <FaCaretLeft className='text-yellow-300 h-8' />
              </button>
              <div className="overflow-hidden w-80 flex-shrink-0">
                <div
                  className="flex gap-4 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(${-currentIndex * 64}px)` }}>
                  {board.map((board) => (
                    <button
                      key={board.size}
                      onClick={() => {
                        setCustomSize(board.size);
                      }}
                      className={`relative rounded-xl flex items-center justify-center border-4 transition w-20 flex-shrink-0 ${customSize === board.size
                        ? 'bg-blue-700 shadow-lg scale-105 border-yellow-300 border-2'
                        : 'bg-gray-700 hover:bg-gray-600 border-white/50 border-2'
                        } ${board.isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                          `} disabled={board.isLocked}
                    >
                      <img
                        src="/images/tic-tac-toe.png"
                        alt={`${customSize} players`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="absolute bottom-2 right-2 bg-white text-black text-[8px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {board.size}X{board.size}
                      </div>
                      {customSize === board.size && <FaCheckCircle className="absolute -top-1 -right-2 w-8 h-8 rounded-full bg-yellow-300 text-white" />}
                      {board.isLocked && <IoIosLock className="absolute -top-1 right-1/3 text-lg brightness-100 opacity-100 text-yellow-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRight}
                className={`flex-shrink-0 ml-4 p-2 ${currentIndex === board.length - 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={currentIndex === board.length - 4}>
                <FaCaretRight className='text-yellow-300 h-8' />
              </button>
            </div>
            {(!board.find((b) => b.size === 4).isLocked && customSize >= 4) && (
              <><SelectPlayers selectedPlayers={customWin} setSelectedPlayers={setCustomWin} enabled={enabled} disabled={[]} button={'Win'} /></>
            )}
          </div>

          {/* Create Lobby / Join (but since create, show Create Lobby) */}
          <div className="w-full max-w-md flex flex-col text-center mb-2">
            <div className="bg-blue-800 border-4 border-yellow-300 w-full px-4 max-w-md 
              text-center shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]">
              <h3 className="font-bold mb-2 text-yellow-400 ">Select Lobby</h3>
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
              <EntryFee setEntryAmount={setEntryAmount} entryAmount={entryAmount} />
              {/* Next Button */}
              <button onClick={() => setStep(1)}
                className={`bg-blue-600 text-white font-bold px-8 py-1 rounded-full shadow-lg
               hover:scale-105 transition mb-4 ${shadow}`}>
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {((!isRoomCreated && step !== 2) || step === 1) && (
        <>
          {/* Select Icon */}
          <SelectIcon />
        </>
      )}
      {(step === 1) && (
        <>
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
            <p className="font-bold text-red-600 mb-4">{(error) && error}</p>
            {/* Enter Private Code */}
            <input type="text" placeholder="Enter private code here..." value={roomId} required onChange={(e) => setRoomId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white text-black mb-4 text-center" />
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
                  {!opponentUser?.user?.profilePicture && (<img
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
            {isLoading ? ' Ready to Play' : 'Loading'}
          </button>
        </div>
      )}
      {step !== 2 && (
        <>
          {/* Bottom Icons: How to Play, Social */}
          <div className="flex justify-center space-x-6 pb-4 max-w-md">
            <FiHelpCircle className="text-2xl hover:scale-110 transition cursor-pointer" title="How to Play" />
            <FiShare2 className="text-2xl hover:scale-110 transition cursor-pointer" title="Share" />
            <FiGift className="text-2xl hover:scale-110 transition cursor-pointer" title="Daily" />
          </div>
        </>
      )}
    </>
  );
};

export default LudoLobby;
