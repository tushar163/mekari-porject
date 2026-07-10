import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';

//Define the store and add the reducers for ui and workspace
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    workspace: workspaceReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
