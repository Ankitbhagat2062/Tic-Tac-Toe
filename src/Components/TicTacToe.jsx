import { ToastContainer, } from 'react-toastify';


import useOnlinePlayStore from "../store/onlinePlayStore";
import { GameBoard, Player, SettingsButton } from './icons';
import { shadow } from '../css/colors';

function TicTacToe() {
  const { timer } = useOnlinePlayStore();
  const player = useOnlinePlayStore((state) => state.player)
  const showSetting = useOnlinePlayStore((state) => state.showSetting)
  const setShowSetting = useOnlinePlayStore((state) => state.setShowSetting)
  const playerSymbol = useOnlinePlayStore((state) => state.playerSymbol)
  const currentPlayer = useOnlinePlayStore((state) => state.currentPlayer)
  const mode = useOnlinePlayStore((state) => state.mode);
  const opponentSymbol = useOnlinePlayStore((state) => state.opponentSymbol)
  const opponentUser = useOnlinePlayStore((state) => state.opponentUser)
  const formatTime = (t) => {
    if (typeof t === "string") return t;
    const minutes = Math.floor(t / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <>
      <ToastContainer />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full h-full md:gap- mt-10">
        <h1>{mode} Game Started</h1>
        <div onClick={() => setShowSetting(!showSetting)} className={`${shadow} overflow-hidden`}>
          <img src="./settings.gif" alt="Setting" className="brightness-110 w-8 h-8 grayscale contrast-[999] mix-blend-multiply bg-transparent" />
        </div>
        {showSetting && (
          <>
            <SettingsButton />
          </>
        )}
        <div className="absolute top-20 left-1/4 transform -translate-x-1/2 bg-white rounded-xl px-3 py-2 text-black font-bold shadow-lg flex items-center justify-center min-w-[100px] border-4 border-blue-700">
          {formatTime(timer)}
        </div>

        {/* Layout wrapper */}
        <div className="flex flex-col items-center justify-center w-full h-full md:gap-6">
          {/* Game Boar  */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square max-w-[400px]">
              <GameBoard />
            </div>
          </div>
          <div className="flex gap-1 items-start justify-between w-full px-4">
            {/* Player 1 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Player player={player || "Player X"} symbol={playerSymbol || "X"} />
              <h1 className="text-sm md:text-base lg:text-lg text-center">
                {(playerSymbol === currentPlayer && currentPlayer) && `Your Turn ${currentPlayer}`}
              </h1>
            </div>
            {/* Player 2 */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Player player={opponentUser.username || "Player O"} symbol={opponentSymbol || "O"} />
              {(opponentSymbol === currentPlayer && currentPlayer) && `${opponentUser.username} Turn ${opponentSymbol}`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TicTacToe;
