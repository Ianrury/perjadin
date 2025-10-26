"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/lib/store/authStore";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-700">AKHDANI</span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-5 bg-gray-400 rounded-sm"></div>
            <div className="w-1.5 h-5 bg-orange-400 rounded-sm"></div>
            <div className="w-1.5 h-5 bg-orange-500 rounded-sm"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">{user?.nama}</span>
              <span className="text-gray-800">▼</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user?.nama}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}