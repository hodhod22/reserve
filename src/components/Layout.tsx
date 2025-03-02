"use client";
import useAutoLogout from "@/hooks/useAutoLogout";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

import "../app/globals.css";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const hideHeader = ["/login", "/register"].includes(pathname);

  // 15-minute timeout (900000 ms)
  const showWarning = useAutoLogout(900000);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main className="flex-grow">
      {children}
      </main>
      {!hideHeader && <Footer />}

      {showWarning && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Session Expiring</h2>
            <p>You will be logged out in 1 minute due to inactivity.</p>
            <button
              onClick={() => {
                window.dispatchEvent(new Event("mousemove"));
                //setShowWarning(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
