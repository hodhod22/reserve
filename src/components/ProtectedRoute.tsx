"use client"; // Mark this as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../app/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "admin"; // Optional role restriction
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (role && user?.role !== role) {
      router.push("/unauthorized"); // Redirect to unauthorized page if role doesn't match
    }
  }, [isAuthenticated, user, role, router]);

  return isAuthenticated && (!role || user?.role === role) ? (
    <>{children}</>
  ) : null;
};

export default ProtectedRoute;
