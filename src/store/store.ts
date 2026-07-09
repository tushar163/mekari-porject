import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    workspace: workspaceReducer,
  },
});

if (import.meta.env.DEV) {
  console.info('[store] initial state', store.getState());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
