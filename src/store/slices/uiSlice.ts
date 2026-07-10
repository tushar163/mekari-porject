import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
interface UiState {
  activeTab: string;
  notice: string | null;
}

const initialState: UiState = {
  activeTab: 'dashboard',
  notice: null,
};

// Create a slice for UI state management of the Sidebar component, including active tab and notice message
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
