"use client"; // Mark this as a Client Component

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store/store";
import { logout } from "../app/features/authSlice";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark component as client-side only
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!isClient) {
    return null; // Prevent mismatched HTML during SSR
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold">
          MyApp
        </Link>
        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/user" className="hover:text-blue-200">
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link href="/dashboard/admin" className="hover:text-blue-200">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-blue-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 hover:text-blue-200"
            >
              <FaUser />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
