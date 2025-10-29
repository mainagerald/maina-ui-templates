import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PageTheme = 'light' | 'dark' | 'transparent';

interface NavigationState {
  currentPage: string;
  pageTheme: PageTheme;
}

const initialState: NavigationState = {
  currentPage: '/',
  pageTheme: 'light',
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setPageTheme: (state, action: PayloadAction<PageTheme>) => {
      state.pageTheme = action.payload;
    },
  },
});

export const { setCurrentPage, setPageTheme } = navigationSlice.actions;
export default navigationSlice.reducer;
