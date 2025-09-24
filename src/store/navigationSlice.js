import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '/',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
  },
});

export const { setCurrentPath } = navigationSlice.actions;
export default navigationSlice.reducer;
