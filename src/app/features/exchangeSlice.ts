import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the payload type for the exchangeCurrency thunk
interface ExchangePayload {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

interface ExchangeState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ExchangeState = {
  loading: false,
  success: false,
  error: null,
};

export const exchangeCurrency = createAsyncThunk(
  "exchange/currency",
  async (payload: ExchangePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/exchange", payload);
      return response.data;
    } catch (err: any) {
      // Handle errors more robustly
      const errorMessage =
        err.response?.data?.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exchangeCurrency.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(exchangeCurrency.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        // If you need to update the user's balance or other state, do it here
      })
      .addCase(exchangeCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exchangeSlice.reducer;
