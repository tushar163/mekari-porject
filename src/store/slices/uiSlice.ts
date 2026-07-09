import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
interface UiState {
  activeTab: string;
  notice: string | null;
}

const initialState: UiState = {
  activeTab: 'dashboard',
  notice: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setNotice(state, action: PayloadAction<string | null>) {
      state.notice = action.payload;
    },
  },
});

export const { setActiveTab, setNotice } = uiSlice.actions;
export default uiSlice.reducer;
