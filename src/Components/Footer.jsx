import React from 'react'
import { FaFacebookF, FaInstagram, FaYoutube, } from 'react-icons/fa';
import { GooglePlayIcon } from "../Assets/react-icons";

const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Play Now Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            PLAY NOW FOR FREE!
                        </h2>

                        {/* App Store Buttons */}
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
                            <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
                                {/* <svg className="w-6 h-6" viewBox="0 0 512 512">
                                    <path fill="#32A350" d="M325.3 234.3L104.7 26.6C97.5 20 85.3 25 85.3 35.3v441.4c0 10.3 12.2 15.3 19.4 8.7l220.6-207.7c6.7-6.3 6.7-16.9 0-23.4z" />
                                    <path fill="#FFD500" d="M378.7 286.7L325.3 234.3 104.7 26.6c-7.1-6.6-19.4-1.6-19.4 8.7v101.2l293.4 150.2z" />
                                    <path fill="#FF4229" d="M378.7 225.3L104.7 385.5v101.2c0 10.3 12.2 15.3 19.4 8.7l220.6-207.7 34-62.4z" />
                                    <path fill="#00AEEF" d="M378.7 225.3l-53.4 61.4 53.4 61.4 85.3-61.4-85.3-61.4z" />
                                </svg> */}
                                <GooglePlayIcon />
                                <div className="text-left">
                                    <div className="text-xs opacity-75">GET IT ON</div>
                                    <div className="font-semibold">Google Play</div>
                                </div>
                            </a>

                            <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C19.44,13.65 20.49,14.36 20.49,14.36C20.49,14.36 19.51,15.58 18.71,19.5Z'/%3E%3C/svg%3E" alt="App Store" className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-xs opacity-75">Download on the</div>
                                    <div className="font-semibold">App Store</div>
                                </div>
                            </a>

                            <a href="#" className=" text-black px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors">
                                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">H</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs opacity-75">EXPLORE IT ON</div>
                                    <div className="font-semibold">AppGallery</div>
                                </div>
                            </a>

                            <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-blue-700 transition-colors">
                                <FaFacebookF className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-xs opacity-75">Play now on</div>
                                    <div className="font-semibold">facebook</div>
                                </div>
                            </a>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex justify-center items-center gap-8 mb-12">
                            <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaFacebookF className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <FaYoutube className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Copyright and Links */}
                        <div className="border-t border-white/20 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-center md:text-left">
                                    <p className="text-white/80 mb-2">
                                        © 2024 TicTacToe. All Rights Reserved.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                                        <a href="#" className="text-blue-400 hover:text-blue-300">FAQ'S</a>
                                        <span className="text-white/40">|</span>
                                        <a href="#" className="text-blue-400 hover:text-blue-300">RNG Certification</a>
                                        <span className="text-white/40">|</span>
                                        <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                                        <span className="text-white/40">|</span>
                                        <a href="#" className="text-blue-400 hover:text-blue-300">Terms Of Service</a>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text">
                                        gametion
                                    </div>
                                </div>

                                <div className="text-center md:text-right">
                                    <p className="text-blue-400 font-semibold">
                                        offline multiplayer games
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer