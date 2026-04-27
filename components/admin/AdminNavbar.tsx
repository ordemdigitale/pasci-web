"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminNavbarProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export default function AdminNavbar({ setSidebarOpen, title = "Tableau de bord" }: AdminNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const roleLabel = user?.is_superuser
    ? "Superuser"
    : user?.is_staff
    ? "Staff"
    : user?.is_redacteur
    ? "Rédacteur"
    : "Utilisateur";

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.email
    : "";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Ici vous pouvez ajouter la logique de déconnexion (clear tokens, etc.)
    // Pour l'instant, on redirige simplement vers la page de login
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-semibold text-xl text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hover:underline text-sm text-gray-600 hover:text-gray-900"
        >
          Visiter le site
        </Link>

        {/* Notifications Button */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2a591d] rounded-full"></span>
        </button>

        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 pr-2 transition-colors"
          >
            <div className="w-8 h-8 bg-[#2a591d] rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{roleLabel}</span>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserCircle size={18} className="text-gray-500" />
                  Mon profil
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={18} className="text-gray-500" />
                  Paramètres
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
