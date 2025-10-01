import './App.css';
import Navbar from './Components/Navbar';
import useOnlinePlayStore from './store/onlinePlayStore';
import Footer from './Components/Footer';

import { useShallow } from 'zustand/shallow';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const { startTimer } = useOnlinePlayStore();
  const customSize = useOnlinePlayStore((state) => state.customSize);

  const { setPlayer, setOpponentUser, setPlayerState, setStartPlay, setMode, setBoardState } = useOnlinePlayStore(
    useShallow((state) => ({
      setPlayer: state.setPlayer,
      setOpponentUser: state.setOpponentUser,
      setPlayerState: state.setPlayerState,
      setStartPlay: state.setStartPlay,
      setMode: state.setMode,
      setBoardState: state.setBoardState,
    })));

  const handlePlayOnline = () => {
    // Navigate to online multiplayer
    navigate('/join');
  };
  const handlePlay = (username) => {

    setOpponentUser({
      username: username,
      profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKcsVMR5kXAqIxXZyDvqymKfKOKFPhBjr3u9caGp1HmqtuGvQ=s96-c",
    });
    setPlayerState("offline");
    setPlayer("Player 1")
    setMode("Classic");
    setStartPlay(true);
    setBoardState(Array(customSize * customSize).fill(null));
    startTimer();
    // Navigate to online multiplayer
    setTimeout(() => {
      navigate('/game');
    }, 200);
  };


  return (
    <div className="">
      < div className="min-h-full">

        <Navbar />
        <header className="relative bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative isolate px-6 pt-14 lg:px-8">
              <div className="mx-auto max-w-2xl">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    Announcing our new custom mode!{' '}
                    <a href="/about" className="font-semibold text-indigo-600">
                      <span aria-hidden="true" className="absolute inset-0" />
                      Read more <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                    Welcome to Tic-Tac-Toe
                  </h1>
                  <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Dive into the classic game of Tic-Tac-Toe! Challenge friends online with chat and voice calls, play against our smart AI, or enjoy custom modes. Simple, fun, and endlessly replayable.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="/login"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a href="/about" className="text-sm/6 font-semibold text-gray-900">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                />
              </div>
            </div>
          </div>
        </header>

        <div>
          <div className="mx-auto max-w-full">

            {/* Main Content */}
            <div className="public-main  flex-1 pt-[60px] my-0 mx-auto; w-full">
              <div className="md:gap-[20px] px-5 grid grid-cols-[repeat(auto-fit,minmax(300px,3fr))]  
           md:grid-cols-[repeat(auto-fit,minmax(300px,2fr))] 
           lg:grid-cols-[repeat(auto-fit,minmax(300px,3fr))]
           gap-10 mb-20 justify-items-center">
                <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-10 text-center transition-all duration-300 max-w-[350px] w-full hover:border-black hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                  <div className="text-[48px] mb-5">🤖</div>
                  <h3 className="text-2xl font-semibold text-black mb-4">Play with AI</h3>
                  <p className="text-base text-[#666] leading-[1.6] mb-7">
                    Challenge our intelligent AI opponent. Perfect your strategy and improve your skills.
                  </p>
                  <button
                    className="bg-black text-white rounded-lg px-8 py-4 text-base font-semibold w-full transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px]"
                    onClick={() => handlePlay("AI")}
                  >
                    Play vs AI
                  </button>
                </div>

                <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-10 text-center transition-all duration-300 max-w-[350px] w-full hover:border-black hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                  <div className="text-[48px] mb-5">👥</div>
                  <h3 className="text-2xl font-semibold text-black mb-4">Play Online</h3>
                  <p className="text-base text-[#666] leading-[1.6] mb-7">
                    Invite friends to play on multiple devices. Create or join game rooms instantly.
                  </p>
                  <button
                    className="bg-black text-white rounded-lg px-8 py-4 text-base font-semibold w-full transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px]"
                    onClick={handlePlayOnline}
                  >
                    Play Online
                  </button>
                </div>
                <div className="bg-white border-2 border-[#e5e5e5] rounded-2xl p-10 text-center transition-all duration-300 max-w-[350px] w-full hover:border-black hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
                  <div className="text-[48px] mb-5">📴</div>
                  <h3 className="text-2xl font-semibold text-black mb-4">Play Offline</h3>
                  <p className="text-base text-[#666] leading-[1.6] mb-7">
                    Play with a friend on the same device. Perfect for quick games anywhere,anytime.</p>
                  <button
                    className="bg-black text-white rounded-lg px-8 py-4 text-base font-semibold w-full transition-all duration-200 hover:bg-[#333] hover:-translate-y-[1px]"
                    onClick={() => handlePlay("Player 2")}
                  >
                    Play Offline
                  </button>
                </div>
              </div>
              {/* Features Section */}
              <div className="mb-20 text-center px-5">
                <h2 className="text-[36px] font-semibold text-black mb-12 md:text-[28px]">
                  Why Choose Our Game?
                </h2>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 max-w-[1000px] mx-auto md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:gap-8">
                  <div className="text-center">
                    <div className="text-[40px] mb-4">📱</div>
                    <h4 className="text-xl font-semibold text-black mb-2">Multi-Device</h4>
                    <p className="text-base text-[#666] leading-[1.5]">
                      Play seamlessly across different devices
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-[40px] mb-4">🚫</div>
                    <h4 className="text-xl font-semibold text-black mb-2">No Ads</h4>
                    <p className="text-base text-[#666] leading-[1.5]">
                      Enjoy uninterrupted gaming experience
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-[40px] mb-4">🎮</div>
                    <h4 className="text-xl font-semibold text-black mb-2">Smart AI</h4>
                    <p className="text-base text-[#666] leading-[1.5]">
                      Challenge yourself with intelligent opponents
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-[40px] mb-4">⚡</div>
                    <h4 className="text-xl font-semibold text-black mb-2">Real-time</h4>
                    <p className="text-base text-[#666] leading-[1.5]">
                      Instant multiplayer gaming experience
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center bg-[#f8f9fa] px-10 py-[50px] sm:px-5 sm:pt-8">
                <p className="text-2xl font-medium text-black mb-8 sm:text-xl">
                  Ready to start playing? Choose your game mode above!
                </p>

                <div className="flex justify-center gap-[60px] mt-8 flex-col md:flex-row md:gap-5">
                  <div className="text-center">
                    <span className="block text-[32px] font-bold text-black mb-1">
                      10K+
                    </span>
                    <span className="text-sm text-[#666] font-medium">Games Played</span>
                  </div>

                  <div className="text-center">
                    <span className="block text-[32px] font-bold text-black mb-1">
                      1K+
                    </span>
                    <span className="text-sm text-[#666] font-medium">Happy Players</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Footer */}
      <Footer />

    </div >
  );
}

export default App;
