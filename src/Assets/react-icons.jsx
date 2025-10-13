import { FiMic } from "react-icons/fi";
import { SiBitcoinsv } from "react-icons/si";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoTennisball } from "react-icons/io5";
import { BiSolidCricketBall } from "react-icons/bi";

export const XIcon = ({ className = "", stroke='' }) => {
  return (
      <svg className={`${className} h-12 w-12 rounded-full !bg-transparent`} width={64} height={64} viewBox="0 0 24 24" role="img" aria-label="X" >
        <g stroke={stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" > <path d="M6 6 L18 18" /> <path d="M18 6 L6 18" /> </g>
      </svg>
  )
}

export const OIcon = ({ className = "" , stroke='' }) => {
  return (
      <svg className={`${className} h-12 w-12 rounded-full !bg-transparent`} width={64} height={64} viewBox="0 0 24 24" role="img" aria-label="O" >
        <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth="5" fill="none" />
      </svg>
  )
}

export const BitcoinIcon = ({ className = "" }) => {
  return (
    <button
      className={`${className} relative rounded-full flex items-center justify-center border-4 transition w-12 h-12 flex-shrink-0`} >
      <SiBitcoinsv className={`h-8 w-8 rounded-full`} />
    </button>
  )
}

export const DollarIcon = ({ className = "" }) => {
  return (
    <button
      className={`${className} relative rounded-full flex items-center justify-center border-4 transition w-12 h-12 flex-shrink-0`} >
      <AiFillDollarCircle className={`h-8 w-8 rounded-full`} />
    </button>
  )
}

export const TennisIcon = ({ className = "" }) => {
  return (
    <button
      className={`${className} relative rounded-full flex items-center justify-center border-4 transition w-12 h-12 flex-shrink-0`} >
      <IoTennisball className={`h-8 w-8 rounded-full `} />
    </button>
  )
}

export const CricketIcon = ({ className }) => {
  return (
    <button
      className={`${className} relative rounded-full flex items-center justify-center border-4 transition w-12 h-12 flex-shrink-0`} >
      <BiSolidCricketBall className={`h-8 w-8 rounded-full`} />
    </button>
  )
}
// 💖🎮 ❌⭕  ₿💲
export const GooglePlayIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main big triangle background (Sky Blue) */}
    <path d="M96 32 L416 256 L96 480 Z" fill="#00AEEF" />

    {/* Green region (upper median slice) */}
    <path d="M96 32 L256 256 L416 256 Z" fill="#32A350" />

    {/* Red region (lower median slice) */}
    <path d="M96 480 L256 256 L416 256 Z" fill="#FF4229" />

    {/* Yellow small center (intersection of medians) */}
    <path d="M96 32 L96 480 L256 256 Z" fill="#FFD500" />
  </svg>
);

export const VoiceIcon = () => {
  return (
    <span className="absolute -top-4 -right-3">
      <div className="relative inline-flex items-center justify-center">
        {/* Bubble */}
        <div className="relative bg-blue-900 border-4 border-green-500 rounded-full w-8 h-8 flex items-center justify-center">
          <FiMic className="text-green-500 text-xl z-1" />

          {/* Top tail */}
          <div className="absolute -top-1.5 left-2 rotate-75 w-4.5 h-4.5 bg-blue-900 border-l-4 border-t-4 border-green-500"></div>
          {/* Bottom tail */}
          <div className="absolute top-3 -left-[3px] -rotate-15 w-4.5 h-4.5 bg-blue-900 border-l-4 border-b-4 border-green-500"></div>
        </div>
      </div>
    </span>
  )
}
