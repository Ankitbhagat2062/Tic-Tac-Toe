import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    navigation: navigationReducer,
  },
});

export default store;
