// features/exchangeRatesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ExchangeRatesState {
  rates: {
    [key: string]: number; // Index signature
    IRR: number;
    GBP: number;
    EUR: number;
    TRY: number;
    AED: number;
    SEK: number;
    USD: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ExchangeRatesState = {
  rates: {
    
    IRR: 0,
    GBP: 0,
    EUR: 0,
    TRY: 0,
    AED: 0,
    SEK: 0,
    USD: 0,
  },
  loading: false,
  error: null,
};

export const fetchExchangeRates = createAsyncThunk(
  "exchangeRates/fetchExchangeRates",
  async () => {
    const response = await axios.get("/api/auth/exchange-rates");
    return response.data.data.rates;
  }
);

const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.rates = action.payload;
        state.loading = false;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch exchange rates";
      });
  },
});

export default exchangeRatesSlice.reducer;
