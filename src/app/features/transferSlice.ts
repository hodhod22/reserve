// features/transferSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store/store';

interface TransferState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: TransferState = {
  loading: false,
  error: null,
  success: false,
};

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    initiateTransfer: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    transferSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    transferFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetTransfer: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  initiateTransfer,
  transferSuccess,
  transferFailure,
  resetTransfer,
} = transferSlice.actions;

// Selectors
export const selectTransferLoading = (state: RootState) => state.transfer.loading;
export const selectTransferError = (state: RootState) => state.transfer.error;
export const selectTransferSuccess = (state: RootState) => state.transfer.success;

export default transferSlice.reducer;