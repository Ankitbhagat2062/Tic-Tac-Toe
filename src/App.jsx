import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

function App() {
  const handlePlayWithAI = () => {
    // Navigate to AI game mode
    window.location.href = '/game/ai';
  };

  const handlePlayOnline = () => {
    // Navigate to online multiplayer
    window.location.href = '/game/online';
  };


  return (
    <div className="">
      < div className="min-h-full">

        <Navbar />
         
        <div className="relative bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-center mb-[80px]">
              <h1 className="welcome-title md:text-[36px] text-[48px] font-bold text-black mb-5 leading-[1.2]">Welcome to TicTacToe</h1>
              <p className="text-xl text-[#666] max-w-[600px] mx-auto leading-[1.6]">
                Play the classic game with friends online or challenge our AI opponent.
                No ads, just pure gaming fun!
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mx-auto max-w-7xl py-6">

            {/* Main Content */}
            <div className="public-main  flex-1 py-[60px] my-0 mx-auto; w-full">
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
                    onClick={handlePlayWithAI}
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
                    onClick={handlePlayOnline}
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
              <div className="text-center bg-[#f8f9fa] rounded-2xl px-10 py-[50px] mb-10 sm:px-5 sm:py-8">
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
