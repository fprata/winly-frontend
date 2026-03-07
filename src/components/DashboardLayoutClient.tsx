"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ToastContainer } from "./ui/Toast";

export function DashboardLayoutClient({
  signOutAction,
  children
}: {
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Sidebar
        signOutAction={signOutAction}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-30 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {children}
      <ToastContainer />
    </>
  );
}
