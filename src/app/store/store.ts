import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import exchangeRatesReducer from "../features/exchangeRateSlice";
import exchangeReducer from "../features/exchangeSlice";
import transferReducer from '../features/transferSlice';
// Load initial state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exchangeRates: exchangeRatesReducer,
    exchange: exchangeReducer,
    transfer:transferReducer
  },
  preloadedState: {
    auth: preloadedState || {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
