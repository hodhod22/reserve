// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  accountNumber: string;
  balance: {
    IRR: number;
    GBP: number;
    EUR: number;
    TRY: number;
    AED: number;
    SEK: number;
    USD: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Load initial state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Log the user object for debugging
      console.log("Logged in user:", action.payload);

      // Save state to local storage
      localStorage.setItem("authState", JSON.stringify(state));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;

      // Clear state from local storage on failure
      localStorage.removeItem("authState");
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear state from local storage on logout
      localStorage.removeItem("authState");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
