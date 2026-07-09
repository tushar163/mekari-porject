import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WorkspaceRecord {
  id: string;
  name: string;
  status: 'active' | 'archived';
}

interface WorkspaceState {
  records: WorkspaceRecord[];
  selectedId: string | null;
}

const initialState: WorkspaceState = {
  records: [
    { id: 'ws-1', name: 'Onboarding Flow', status: 'active' },
    { id: 'ws-2', name: 'Billing Revamp', status: 'active' },
    { id: 'ws-3', name: 'Legacy Reports', status: 'archived' },
  ],
  selectedId: 'ws-1',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    selectRecord(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    renameRecord(state, action: PayloadAction<{ id: string; name: string }>) {
      const record = state.records.find((r) => r.id === action.payload.id);
      if (record) record.name = action.payload.name;
    },
    toggleArchived(state, action: PayloadAction<string>) {
      const record = state.records.find((r) => r.id === action.payload);
      if (record) record.status = record.status === 'active' ? 'archived' : 'active';
    },
  },
});

export const { selectRecord, renameRecord, toggleArchived } = workspaceSlice.actions;
export default workspaceSlice.reducer;
