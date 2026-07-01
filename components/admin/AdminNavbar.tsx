"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { INotification } from "@/types/api.types";

interface AdminNavbarProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export default function AdminNavbar({ setSidebarOpen, title = "Tableau de bord" }: AdminNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const roleLabel = user?.is_superuser
    ? "Superuser"
    : user?.is_staff
    ? "Staff"
    : user?.is_redacteur
    ? "Rédacteur"
    : "Utilisateur";

  // Platform settings (superuser or global staff without crasc_id)
  // Account settings for everyone else (crascAdmin, rédacteur, osc…)
  const settingsHref =
    user?.is_superuser || (user?.is_staff && !user?.crasc_id)
      ? "/admin/settings"
      : "/admin/profile";

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.email
    : "";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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

  const loadNotifications = async () => {
    if (!user) return;
    setNotificationsLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        fetchWithAuth(API_ENDPOINTS.notifications.list),
        fetchWithAuth(API_ENDPOINTS.notifications.unreadCount),
      ]);
      if (listRes.ok) {
        const data = await listRes.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
      if (countRes.ok) {
        const data = await countRes.json();
        setUnreadCount(Number(data.unread_count || 0));
      }
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((item) => item.id === notification.id ? { ...item, is_read: true } : item)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await fetchWithAuth(API_ENDPOINTS.notifications.markRead(notification.id), { method: "PATCH" }).catch(() => {});
    }
    setShowNotifications(false);
    if (notification.link_url) {
      router.push(notification.link_url);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
    await fetchWithAuth(API_ENDPOINTS.notifications.markAllRead, { method: "PATCH" }).catch(() => {});
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
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              const next = !showNotifications;
              setShowNotifications(next);
              if (next) loadNotifications();
            }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#2a591d] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-500">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-[#2a591d] hover:underline"
                  >
                    Tout lire
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">Chargement...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">Aucune notification</div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        notification.is_read ? "bg-white" : "bg-green-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.is_read && (
                          <span className="mt-1.5 w-2 h-2 bg-[#2a591d] rounded-full flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
                  href={settingsHref}
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
