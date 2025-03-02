// components/AutoLogoutWrapper.tsx
"use client";
import useAutoLogout from "@/hooks/useAutoLogout";

const AutoLogoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const showWarning = useAutoLogout(900000, 600000); // 15 minutes total, 1 minute warning

  return (
    <>
      {children}
      {showWarning && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
          You will be logged out due to inactivity in 5 minute. Move the mouse
          or press a key to stay logged in.
        </div>
      )}
    </>
  );
};

export default AutoLogoutWrapper;
