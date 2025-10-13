
import { XIcon, OIcon , BitcoinIcon, DollarIcon, TennisIcon } from "./react-icons";

export const colors = [
  { id: 'red', bg: 'bg-red-500', border: 'border-red-400', },
  { id: 'green', bg: 'bg-green-500', border: 'border-green-400', },
  { id: 'yellow', bg: 'bg-yellow-500', border: 'border-yellow-400', },
  { id: 'blue', bg: 'bg-blue-500', border: 'border-blue-400', },
];
export const Icons = [
  { id: 'X', icon: XIcon },
  { id: '0', icon: OIcon  },
  { id: 'bitcoin', icon:BitcoinIcon, isLocked: true },
  { id: 'dollar', icon: DollarIcon, isLocked: true },
  { id: 'tennis', icon: TennisIcon, isLocked: true },
  { id: 'cricket', icon: TennisIcon, isLocked: true },
]

export const shadow = 'shadow-[0_0_15px_5px_rgba(255,215,0,0.7)] bg-blue-600 text-white font-bold rounded-lg outline-yellow-400 outline-2 outline-offset-2 drop-shadow-md drop-shadow-yellow-400 hover:outline-4 hover:outline-offset-4 hover:drop-shadow-lg hover:drop-shadow-yellow-400 transition-all duration-300 ease-in-out '

export  const board = [
    { size: 3, },
    { size: 4, isLocked: true },
    { size: 5, isLocked: true },
    { size: 6, isLocked: true },
    { size: 7, isLocked: true },
    { size: 8, isLocked: true },
  ]