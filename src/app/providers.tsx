"use client"; // Mark this as a Client Component
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
