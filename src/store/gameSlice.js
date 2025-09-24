import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  
  customWin: 3,
  customSize: 3,
  // 👇 New states moved from useState
  player:'',
  playerState:'',
  mode:'',
  startPlay: false,
  
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {


    setPlayer: (state , action) => {
      state.player = action.payload
    },
    setPlayerState: (state , action) => {
      state.playerState = action.payload
    },   
    setStartPlay: (state, action) => {
      state.startPlay = action.payload;
    },
    setCustomWin: (state, action) => {
      state.customWin = action.payload;
    },
    setCustomSize: (state, action) => {
      state.customSize = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
     resetGameState: () => {
      return initialState;
    },
  },
});

export const {  
  setPlayer,
  setStartPlay,
  setPlayerState,

  setCustomWin,
  setCustomSize,
  setMode,

  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
