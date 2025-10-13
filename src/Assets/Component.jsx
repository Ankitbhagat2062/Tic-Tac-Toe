import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosLock } from 'react-icons/io';
import { TbArrowBackUp } from "react-icons/tb";
import { FaAward, FaCaretLeft, FaCaretRight, FaCheck, FaCheckCircle, FaCheckSquare, FaCoins, FaForward, FaGem, FaMapPin, FaMinus, FaPlus, FaRegCircle } from 'react-icons/fa';
import { FiHelpCircle, FiRotateCw } from 'react-icons/fi';

import useOnlinePlayStore from "../store/onlinePlayStore";
import { colors, Icons, shadow } from "../Assets/colors";
console.clear(motion);

export const Player = ({ player, color }) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-blue-700 rounded-lg md:p-6 md:w-32 md:h-40 w-18 h-24 shadow-lg">
                <div className="md:w-16 md:h-20 w-7 h-9 flex items-center justify-center bg-blue-900 rounded-md mb-2">
                    <span className="md:text-6xl text-2xl text-cyan-400 font-extrabold">
                        {Icons.filter(u => u.id === player?.symbol?.id).map((icon) => (
                            <icon.icon stroke={color?.id} key={icon.id}
                                className={`relative rounded-full flex items-center justify-center transition w-12 h-12 flex-shrink-0
                        ${color?.bg} ${color?.border} hover:scale-105 shadow-lg scale-110
                        `} />
                        ))}
                    </span>
                </div>
                <span className="text-white font-semibold md:text-lg text-sm">{player?.user?.username}</span>
            </div>
        </>
    )
}

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


export const SelectPlayers = ({ enabled, disabled, button, shadow, selectedPlayers, setSelectedPlayers }) => {
    const [fivePEnabled, setFivePEnabled] = useState(false);

    const handleToggle = () => {
        setFivePEnabled(!fivePEnabled);
        // When toggling, reset selected players accordingly
        setSelectedPlayers(!fivePEnabled ? enabled[1] : enabled[0]);
    };
    const label = button === 'Win' ? button : '5P/6P'
    const playerOptions = fivePEnabled
        ? enabled
        : disabled;

    return (
        <div className={`bg-blue-900 rounded-lg max-w-full mx-auto text-center
         ${shadow}`}>
            {button !== 'Win' && <h2 className="text-yellow-400 text-3xl font-extrabold mb-6 tracking-widest drop-shadow-[0_0_5px_rgba(255,215,0,0.9)]">
                SELECT PLAYERS
            </h2>}
            <div className="grid grid-cols-2 flex-wrap gap-2">
                {playerOptions.map((num) => (
                    <button
                        key={num}
                        onClick={() => setSelectedPlayers(num)}
                        className={`relative flex items-center justify-center text-white text-sm md:text-xl font-bold px-1 md:px-4 py-2 rounded-full cursor-pointer select-none
                            ${selectedPlayers === num ? 'text-yellow-400' : 'text-white'}
                        `}
                        style={{
                            filter: selectedPlayers === num ? 'drop-shadow(0 0 8px #FFD700)' : 'none',
                        }}
                    >
                        <span className={` w-7 h-7 mr-2 rounded-full border-4 border-yellow-400 flex items-center justify-center
                            ${selectedPlayers === num ? 'bg-yellow-400' : 'bg-transparent'}
                        `}>
                            {selectedPlayers === num && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </span>
                        {num} {button}
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-end mx-2 mt-1 text-yellow-400 font-bold text-xl select-none">
                <ToggleSwitch
                    label={label}
                    checked={fivePEnabled}
                    onToggle={handleToggle}
                    onColor="#4ade80" // green
                    offColor="#f87171" // red
                    thumbColor="white"
                />
            </div>
        </div>
    );
}

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
    fixed top-1 flex flex-col items-center justify-center px-4 w-full overflow-hidden gap-5">
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

export const SelectIcon = () => {
    const { selectedIcon, selectedColor, currentIndex, setSelectedIcon, setSelectedColor, setCurrentIndex, } = useOnlinePlayStore();
    const isPlayingWith = useOnlinePlayStore((state) => state.isPlayingWith)
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
            <div className="max-w-md w-full mb-3 border-4 border-yellow-300 bg-blue-600 pb-2 shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]">
                <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">Select Icon/ Color</h2>
                <div className="flex justify-around flex-col gap-2.5 mx-2.5">
                    <div className="w-full flex items-center justify-center">
                        <button
                            onClick={handleLeft}
                            className={`flex-shrink-0 mr-4 p-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={currentIndex === 0}
                        >
                            <FaCaretLeft className='text-yellow-300 h-8' />
                        </button>
                        <div className="overflow-hidden w-64 flex-shrink-0">
                            <div
                                className="flex gap-4 transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(${-currentIndex * 64}px)` }}>
                                {Icons.map((icon) => (
                                    <div key={icon.id} className='relative'
                                        onClick={() => setSelectedIcon(icon)}>
                                        <icon.icon stroke={selectedColor?.id}
                                            className={`${selectedColor ? `${selectedColor.bg} ${selectedColor.border}`
                                                : `bg-gray-600 border-gray-500 hover:scale-105 shadow-lg scale-110`}
                                        ${icon.isLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                            disabled={icon.isLocked}>
                                        </icon.icon>
                                        {(selectedIcon.id === icon.id && !icon.isLocked) && <FaCheckSquare className='absolute top-0 left-0 bg-yellow-300' />}
                                        {icon.isLocked && <IoIosLock className="absolute top-1 right-1/3 font-extrabold text-sm text-yellow-400" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleRight}
                            className={`flex-shrink-0 ml-4 p-2 ${currentIndex === Icons.length - 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={currentIndex === Icons.length - 4}
                        >
                            <FaCaretRight className='text-yellow-300 h-8' />
                        </button>
                    </div>
                    <div className="w-full bg-white h-1"></div>
                    {isPlayingWith !== 'Human' &&
                        <div className="colors flex justify-center items-center gap-4 transition-transform duration-500 ease-in-out">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => selectColor(color)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition flex-shrink-0 ${color.bg}
                                ${selectedColor.id === color.id && `outline-2 outline-white`} 
                                ${color.border} shadow-lg scale-110`}>
                                    {selectedColor.id === color.id && <FaCheck />}
                                </button>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

import { FaDice } from 'react-icons/fa';

export const SelectName = ({handleStartGame}) => {
    const { setOpponentUser, setPlayer } = useOnlinePlayStore();
    // Example player data, replace with your store logic
    const [players, setPlayers] = useState([
        {
            player: { user: { username: 'Player 1' }, symbol: {id:Icons[0].id , icon: Icons[0].icon, color: colors[0] } },
            opponent: { user: { username: 'Player 2' }, symbol: { id:Icons[1].id ,icon: Icons[1].icon, color: colors[1] } },
            selected: false
        },
        {
            player: { user: { username: 'Player 1' }, symbol: { id:Icons[0].id ,icon: Icons[0].icon, color: colors[2] } },
            opponent: { user: { username: 'Player 2' }, symbol: {id:Icons[1].id , icon: Icons[1].icon, color: colors[3] } },
            selected: false
        },
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSelect = (idx) => {
        setSelectedIndex(idx);
        setPlayers(players.map((p, i) => ({
            ...p,
            selected: i === idx
        })));
    };

    const handleNameChange = (idx, value) => {
        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map((p, i) =>
                i === idx ? { ...p, player: { ...p.player, user: { ...p.player.user, username: value } } } : p
            );
            setPlayer(updatedPlayers[idx].player);
            return updatedPlayers;
        });
    }

    const handleOpponentChange = (idx, value) => {
        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map((p, i) =>
                i === idx ? { ...p, opponent: { ...p.opponent, user: { ...p.opponent.user, username: value } } } : p
            );
            setOpponentUser(updatedPlayers[idx].opponent);
            return updatedPlayers;
        });
    }

    return (
        <div className={`w-full max-w-md px-2 py-0 rounded-none mb-2 border-4 border-yellow-400 shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]`}
            style={{
                background: "linear-gradient(to bottom, #003399 60%, #0055cc 100%)",
                borderTop: "6px solid #FFD700",
            }}>
            <div className="flex items-center justify-between px-4 py-2 bg-[#003399] border-b-2 border-yellow-400">
                <span className="text-yellow-400 font-extrabold text-lg tracking-wide">CHOOSE COLOR AND NAME</span>
                <span className="flex items-center gap-1 text-white font-bold text-md">
                    <i className="fa fa-users" /> 0/0
                </span>
                <FiHelpCircle className="text-yellow-400" />
            </div>
            <div className="flex flex-col gap-2 px-4 py-4 bg-[#003399]">
                {players.map((player, idx) => (
                    <div key={idx} className={`flex items-center ${selectedIndex} gap-3 py-2 ${player?.selected ? "bg-blue-700 rounded-lg" : ""}`}>
                        <button
                            onClick={() => handleSelect(idx)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-400 bg-white`}
                            style={{
                                boxShadow: player?.selected ? "0 0 8px #FFD700" : "none"
                            }}
                        >
                            {player?.selected ? (
                                <FaCheck className="text-green-500 text-2xl" />
                            ) : (
                                <FaRegCircle className="text-green-500 text-2xl" />
                            )}
                        </button>
                        <div className="flex flex-col gap-1 items-center">
                            <div className="flex items-center">
                                <player.player.symbol.icon stroke={player?.player?.symbol?.color?.id} className={`${player?.player?.symbol?.color?.bg} ${player?.player?.symbol?.color?.border} hover:scale-105 shadow-lg scale-110`} />
                                <input
                                    type="text"
                                    value={player?.player?.user?.username}
                                    onChange={e => handleNameChange(idx, e.target.value)}
                                    className="bg-white border-2 border-dotted border-gray-400 rounded-md px-2 py-1 text-black font-bold w-28 text-center"
                                />
                                <FaDice className="text-gray-300 text-2xl ml-2" />
                            </div>
                            <div className="flex items-center">
                                <player.opponent.symbol.icon stroke={player?.opponent?.symbol?.color?.id} className={`${player?.opponent?.symbol?.color?.bg} ${player?.opponent?.symbol?.color?.border} hover:scale-105 shadow-lg scale-110`} />
                                <input
                                    type="text"
                                    value={player?.opponent?.user?.username}
                                    onChange={e => handleOpponentChange(idx, e.target.value)}
                                    className="bg-white border-2 border-dotted border-gray-400 rounded-md px-2 py-1 text-black font-bold w-28 text-center"
                                />
                                <FaDice className="text-gray-300 text-2xl ml-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <div className="flex justify-center gap-2 py-3 bg-[#003399] border-t-2 border-yellow-400">
                {["2P", "3P", "4P", "5P", "6P"].map((label, i) => (
                    <button
                        key={label}
                        className="px-5 py-2 rounded-full bg-[#003399] border-2 border-yellow-400 text-yellow-400 font-extrabold text-lg shadow-[0_0_8px_rgba(255,215,0,0.7)]"
                        style={{
                            boxShadow: "0 0 8px #FFD700",
                            textShadow: "1px 1px 2px #000"
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div> */}
            <div className="flex flex-col items-center gap-2 py-4 bg-[#003399]">
                <button onClick={() => handleStartGame()} className="w-64 py-3 rounded-[25px] bg-[#2196F3] text-white border-2 border-yellow-400 text-xl font-bold shadow-[0_0_8px_rgba(255,215,0,0.7)] mb-2">
                    Play
                </button>
            </div>
        </div>
    );
}

export const SelectGame = ({ games }) => {
    const { selectedGame, setSelectedGame, setMode } = useOnlinePlayStore();
    const onlineUsers = useOnlinePlayStore((state) => state.onlineUsers);
    const playerState = useOnlinePlayStore((state) => state.playerState);

    // Icon for Mask Mode (using emoji as no direct react-icon)
    const maskIcon = <span className="absolute -top-1 -right-1 text-yellow-400 text-sm select-none" role="img" aria-label="mask">😷</span>;

    return (
        <>
            <div className={`w-full max-w-md mb-3 px-4 py-4 bg-blue-900 border-4 border-yellow-400 rounded-lg
             shadow-[0_0_15px_5px_rgba(255,215,0,0.7)] `}>
                <h2 className="text-2xl font-extrabold mb-6 text-center text-yellow-400 flex items-center justify-center gap-2 select-none">
                    SELECT GAME
                    <FiHelpCircle className="text-yellow-400" />
                </h2>
                <div className="flex flex-col gap-4">
                    {games.map((game) => {
                        const isSelected = selectedGame === game;
                        return (
                            <button
                                key={game}
                                onClick={() => {
                                    setSelectedGame(game);
                                    setMode(game);
                                }}
                                className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 border-4
                                    ${isSelected
                                        ? 'bg-blue-600 border-yellow-400 shadow-[0_0_10px_3px_rgba(255,215,0,0.9)] scale-105'
                                        : 'bg-blue-800 border-blue-700 hover:border-yellow-400 hover:shadow-[0_0_8px_2px_rgba(255,215,0,0.7)]'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-center w-full mb-1">
                                    {isSelected ? (
                                        <FaCheckCircle className="text-yellow-400 text-xl mr-2" />
                                    ) : (
                                        <FaRegCircle className="text-yellow-400 text-xl mr-2" />
                                    )}
                                    <span className="text-white font-bold text-lg uppercase select-none">{game}</span>
                                    {/* Right side icon */}
                                    <span className="ml-auto relative">
                                        {game === 'Quick' && <FiRotateCw className={`text-yellow-400 text-xl ${isSelected ? 'text-white' : ''}`} />}
                                        {game === 'Classic' && <FaAward className={`text-yellow-400 text-xl ${isSelected ? 'text-white' : ''}`} />}
                                        {game === 'Popular' && <FiRotateCw className={`text-yellow-400 text-xl ${isSelected ? 'text-white' : ''}`} />}
                                        {game === 'Mask Mode' && maskIcon}
                                    </span>
                                </div>
                                {playerState === 'online' &&
                                    <div className="flex items-center gap-2 text-yellow-400 text-sm select-none">
                                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                        <span>Players: {onlineUsers.length}</span>
                                    </div>
                                }
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

// ✅ Opponent chooser with animation + auto room creation/join
export const SearchUser = ({ user, onlineUser }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [nextOpponent, setNextOpponent] = useState(null);
    const [hasSelected, setHasSelected] = useState(false); // prevents re-running after selection
    // Removed unused variables to fix eslint errors
    const roomId = useOnlinePlayStore((state) => state.roomId);
    const { createRoom } = useOnlinePlayStore();

    useEffect(() => {
        if (hasSelected) return; // Don't run if already selected
        if (!onlineUser.length) {
            toast('No user connected');
            return;
        }

        setNextOpponent(onlineUser[1 % onlineUser.length]); // Initialize nextOpponent

        // Cycle through users every 1s
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const newIndex = (prev + 1) % onlineUser.length;
                setNextOpponent(onlineUser[(newIndex + 1) % onlineUser.length]);
                return newIndex;
            });
        }, 200);

        // After one full cycle → pick a random opponent
        const timeout = setTimeout(() => {
            clearInterval(interval);
            const randomUser = onlineUser[Math.floor(Math.random() * onlineUser.length)];
            setSelectedUser(randomUser);
            setNextOpponent(randomUser); // Set nextOpponent to selected
            setHasSelected(true); // Prevent re-running
            if (!roomId) {
                // If room not created yet → create one
                createRoom("online", randomUser);
            } else {
                // If room already created → join it
                // joinRoom(roomId, user);
            }
        }, 1000 * onlineUser.length);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [onlineUser.length, createRoom, hasSelected, onlineUser, roomId]);

    const currentOpponent = selectedUser || onlineUser[currentIndex];
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
                    />
                </div>

                {/* Opponent name only after animation ends */}
                {hasSelected ? (
                    <motion.div>
                        {nextOpponent?.username || "???"}
                    </motion.div>
                ) : (
                    <p>{nextOpponent?.username ? 'Searching...' : "No User Found"}</p>
                )}
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

export const EntryFee = ({ entryAmount, setEntryAmount, className }) => {
    // Update this I want its design exactly like this screent shot 
    // if  isPlayingWith === 'friends' then entryAmount will increase or decrease in format  is 100 , 500 , 1000 ,
    //  5000 ,10000 , 50000 , 100000 ,.                                  
    //  If isPlayingWith === 'friends'and isKingPass is false then above 100 from 500 all be locked like this screenshot 
    // I have 2 screenshot where there is not any upper border and shadow, no span of win and entryAmount*1.9 this is when 
    // isPlayingWith === friends and other 2 screenshot where there is title select game and upto 5/25 trophycup with upper
    //  border and shadow that when isPlayingWith === 'online' when isPlayingWith === 'online' and mode === 'Quick' 
    // entryAmount will increase/decrease in format 500 , 1000 , 5000 , 10000 , 50000 , 100000, 1000000 , 10000000 and
    //  upto will increase in format 5 , 10 , 15 ,25 , 35lvl5 , 45lvl8 , 75 lvl14 , 105 lvl 16 simultaneously each time 
    //  plus or minus button is clicked i have also given information when it will locked. you need to  lock at and from lvl
    //  5 upto 35 and entryAmount 50000   ,win amount is 1.9 * entryAmount lvl is level
    // const { setUpto, } = useOnlinePlayStore();
    const isPlayingWith = useOnlinePlayStore((state) => state.isPlayingWith);
    // const isKingPass = useOnlinePlayStore((state) => state.isKingPass);
    // const upto = useOnlinePlayStore((state) => state.upto);
    // const mode = useOnlinePlayStore((state) => state.mode);
    // const level = useOnlinePlayStore((state) => state.level);

    return (
        <>
            <div className={`flex flex-col justify-center space-x-4 items-center bg-blue-800 w-full p-4
              ${isPlayingWith === 'friends' ? '' : 'border-4'} border-yellow-400 ${className}`}>
                {isPlayingWith === 'randomUser' && <h2 className="text-2xl font-extrabold mb-3 text-center text-yellow-400 flex items-center justify-center gap-2 select-none">
                    SELECT GAME
                    <FiHelpCircle className="text-yellow-400" />
                </h2>}
                <div className={`flex justify-center space-x-4 mb-4 items-center`}>
                    <button onClick={() => setEntryAmount(Math.max(100, entryAmount - 100))}
                        className={`flex items-center space-x-1 px-4 h-10 rounded-lg font-bold border-2 ${entryAmount <= 100 ? 'border-amber-400/35 bg-blue-900/35' : 'border-amber-400 bg-blue-400'}`}>
                        <FaMinus />
                    </button>
                    <div className="flex p-2 flex-col bg-yellow-300 rounded-xl">
                        <div className="flex flex-col items-center justify-center gap-2 bg-gray-400 rounded-t-xl p-2">
                            <div className="flex items-center justify-center">
                                <FaCoins className='text-yellow-300' size={25} />
                                {isPlayingWith === 'randomUser' && <span className='px-2 font-extrabold text-white rounded-xl'>Win</span>}
                            </div>
                            {isPlayingWith === 'randomUser' && <span className='px-4 bg-gray-600 text-white rounded-xl'>{entryAmount * 1.9}</span>}
                        </div>
                        <span className='font-extrabold text-black text-sm py-1'>Entry:{entryAmount}</span>
                    </div>
                    <button onClick={() => setEntryAmount(entryAmount + 100)}
                        className={`flex items-center space-x-1 px-4 h-10 rounded-lg font-bold border-2 border-amber-400 bg-blue-400`}>
                        <FaPlus />
                    </button>
                </div>
            </div>
        </>
    )
}

export const ArrowBack = () => {
    const { step, setStep, cleanup } = useOnlinePlayStore();
    return (
        <div className="absolute top-0 left-0 bg-blue-500">
            <button onClick={() => {
                if (step === 2) {
                    setStep(1);
                } else if (step === 1) {
                    setStep(0);
                } else if (step === 0) {
                    cleanup();
                }
            }}>
                <TbArrowBackUp className='h-8 w-8 text-yellow-500' />
            </button>
        </div>
    )
}