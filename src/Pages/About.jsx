import React from 'react';
import { FaPlay } from 'react-icons/fa';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Navbar Section  */}
      <Navbar />
      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center">
        <div className="max-w-[80vw] mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ABOUT US
          </h1>

          <div className="flex flex-col items-center lg:flex-row gap-12 mt-16">
            {/* Game Image */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <img
                  src="./images/tic-tac-toe.png"
                  alt="Tic Tac Toe Game"
                  className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
                />
                <span className='sr-only'> Tic Tac Toe </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-left space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                India's No.1 Game!
              </h2>

              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  <span className="text-blue-400">🎲 Tic Tac Toe</span>, the popular strategy game, is a digital adaptation of the
                  classic <span className="text-blue-400">🎯 board game</span> available on mobile. It offers online
                  and offline multiplayer modes with many features for nonstop
                  entertainment. With its colorful design, engaging gameplay, and
                  nostalgic appeal, Tic Tac Toe has become one of the top
                  downloaded games worldwide. <span className="text-blue-400">🏆 Best video game consoles</span>
                </p>

                <p className="text-blue-400">
                  🎮 <span className="text-white">Tic Tac Toe merchandise</span>
                </p>
              </div>

              <div className="pt-8">
                <h3 className="text-xl font-bold text-white mb-6">Achievements & Milestones</h3>
                <ul className="space-y-3 text-sm">
                  <li>• Tic Tac Toe crossed 1 Billion downloads globally in 2023.</li>
                  <li>• Tic Tac Toe received the "The Most Popular Game Of The Year" award at the India Gaming Awards 2022</li>
                  <li>• Tic Tac Toe was featured as Gametion's flagship success on Android Developers</li>
                  <li>• Tic Tac Toe emerged as the No. 1 free game on <span className="text-blue-400">📱 app store</span> India in 2020</li>
                  <li>• Tic Tac Toe ranked in the top three games globally on Android in 2020</li>
                  <li>• Tic Tac Toe was one of the top global games with 50 crore downloads in a quarter.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <FaPlay className="text-sm" />
                  Tic Tac Toe board game
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <FaPlay className="text-sm" />
                  Tic Tac Toe Neo-Classic game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
