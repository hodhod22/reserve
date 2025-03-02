// hooks/useAutoLogout.ts
"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/app/features/authSlice";
import { useRouter } from "next/navigation";

const useAutoLogout = (timeout: number, warningTime: number = 60000) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetTimers = () => {
      // Clear existing timers
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);

      // Hide the warning
      setShowWarning(false);

      // Set a new warning timer
      warningTimer = setTimeout(() => {
        setShowWarning(true); // Show warning before logout
      }, timeout - warningTime);

      // Set a new logout timer
      logoutTimer = setTimeout(() => {
        dispatch(logout()); // Logout the user
        router.push("/login"); // Redirect to login page
      }, timeout);
    };

    const handleUserActivity = () => {
      resetTimers(); // Reset timers on user activity
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    // Initialize timers
    resetTimers();

    // Cleanup function to clear timers and remove event listeners
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
    };
  }, [dispatch, router, timeout, warningTime]);

  return showWarning;
};

export default useAutoLogout;
