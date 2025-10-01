import { SiBitcoinsv } from "react-icons/si";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoTennisball } from "react-icons/io5";
import { BiSolidCricketBall } from "react-icons/bi";
import { AutoColorX, AutoColorO } from "../Components/icons";

// Tailwind default 500 shades
export const tailwind500 = {
  "bg-red-500":   "#ef4444",
  "bg-blue-500":  "#3b82f6",
  "bg-green-500": "#22c55e",
  "bg-yellow-500":"#eab308",
  "bg-purple-500":"#a855f7",
  "bg-pink-500":  "#ec4899",
  "bg-indigo-500":"#6366f1",
  "bg-gray-500":  "#6b7280",
};

 export const colors = [
    { id: 'red', bg: 'bg-red-500', border: 'border-red-400', },
    { id: 'green', bg: 'bg-green-500', border: 'border-green-400', },
    { id: 'yellow', bg: 'bg-yellow-500', border: 'border-yellow-400', },
    { id: 'blue', bg: 'bg-blue-500', border: 'border-blue-400', },
  ];
export  const Icons = [
    { id: 'X', icon: AutoColorX },
    { id: '0', icon: AutoColorO },
    { id: 'bitcoin', icon: SiBitcoinsv , isLocked: true },
    { id: 'dollar', icon: AiFillDollarCircle , isLocked: true },
    { id: 'tennis', icon: IoTennisball , isLocked: true },
    { id: 'cricket', icon: BiSolidCricketBall , isLocked: true },
  ]

export const shadow = 'bg-blue-600 text-white font-bold rounded-lg outline-yellow-400 outline-2 outline-offset-2 drop-shadow-md drop-shadow-yellow-400 hover:outline-4 hover:outline-offset-4 hover:drop-shadow-lg hover:drop-shadow-yellow-400 transition-all duration-300 ease-in-out '

