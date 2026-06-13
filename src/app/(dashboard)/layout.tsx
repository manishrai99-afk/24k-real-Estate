"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Radio,
  FolderLock,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStoredData,
  initialLeads,
  initialProperties,
  initialDeals,
} from "../../lib/mock-data";

type ToastType = "success" | "info" | "warning" | "error";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
}>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const toastIcons = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.exiting ? "toast-exit" : ""}`}
            onClick={() => onDismiss(toast.id)}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Live Clock Hook ──────────────────────────────────────────
function useLiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

// ─── Main Layout ──────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const clock = useLiveClock();
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastCounter = React.useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead 'Suhas Kulkarni' from Google Ads assigned to Amit Kulkarni", time: "5 mins ago", unread: true },
    { id: 2, text: "Site visit confirmed for VTP Blue Waters T4-1804, Wakad", time: "1 hour ago", unread: true },
    { id: 3, text: "Deal DL-0021 (Godrej 24 TB-1602) advanced to Closure stage", time: "3 hours ago", unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate WebSocket connection
  useEffect(() => {
    const timer = setTimeout(() => setWsConnected(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Leads CRM", href: "/leads", icon: Users },
    { name: "Properties", href: "/properties", icon: Building2 },
    { name: "Site Visits", href: "/site-visits", icon: CalendarDays },
    { name: "Deals Pipeline", href: "/deals", icon: TrendingUp },
    { name: "Commissions", href: "/commissions", icon: DollarSign },
    { name: "Communication", href: "/communication", icon: MessageCircle },
    { name: "Marketing", href: "/marketing", icon: BarChart3 },
    { name: "Documents", href: "/documents", icon: FolderLock },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Load local state lists for global search matching
  const [searchLeads, setSearchLeads] = useState<any[]>([]);
  const [searchProperties, setSearchProperties] = useState<any[]>([]);
  const [searchDeals, setSearchDeals] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchLeads(getStoredData("crm_leads", initialLeads));
      setSearchProperties(getStoredData("crm_properties", initialProperties));
      setSearchDeals(getStoredData("crm_deals", initialDeals));
      
      const handleSync = () => {
        setSearchLeads(getStoredData("crm_leads", initialLeads));
        setSearchProperties(getStoredData("crm_properties", initialProperties));
        setSearchDeals(getStoredData("crm_deals", initialDeals));
      };
      window.addEventListener("crm-state-update", handleSync);
      return () => window.removeEventListener("crm-state-update", handleSync);
    }
  }, []);

  const matchingLeads = searchQuery ? searchLeads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];
  const matchingProperties = searchQuery ? searchProperties.filter(p => p.project.toLowerCase().includes(searchQuery.toLowerCase()) || p.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];
  const matchingDeals = searchQuery ? searchDeals.filter(d => d.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];

  const hasSearchResults = matchingLeads.length > 0 || matchingProperties.length > 0 || matchingDeals.length > 0;

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-[#060709] text-gray-100 flex">
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* ─── Desktop Sidebar ────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-[270px] bg-[#08090c] border-r border-[#111520] shrink-0">
          {/* Brand Logo */}
          <div className="h-[72px] flex items-center px-7 border-b border-[#111520] gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-brand-500/10 tracking-tight">
              24K
            </div>
            <div>
              <h1 className="font-bold text-[15px] tracking-tight text-white leading-none">24K REALTORS</h1>
              <span className="text-[9px] text-brand-400 font-semibold tracking-[0.15em] uppercase">Property Consultant</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-[13px] ${
                    isActive
                      ? "bg-gradient-to-r from-brand-950/50 to-brand-900/10 text-white font-semibold shadow-sm"
                      : "text-gray-500 hover:bg-[#0f1117] hover:text-gray-300"
                  }`}
                >
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-brand-400" : "text-gray-600"}`} />
                  <span>{item.name}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-5 border-t border-[#111520] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                RD
              </div>
              <div>
                <p className="font-semibold text-white text-xs leading-none">Rohan Deshmukh</p>
                <span className="text-[10px] text-gray-600">Super Admin</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-950/20"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* ─── Mobile Sidebar ─────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed top-0 bottom-0 left-0 w-72 z-50 bg-[#08090c] border-r border-[#111520] flex flex-col"
              >
                <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#111520]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-black text-base">
                      24K
                    </div>
                    <h1 className="font-bold text-sm tracking-tight text-white">24K REALTORS</h1>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-[13px] ${
                          isActive
                            ? "bg-gradient-to-r from-brand-950/50 to-brand-900/10 text-white font-semibold"
                            : "text-gray-500 hover:bg-[#0f1117] hover:text-gray-300"
                        }`}
                      >
                        <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-brand-400" : ""}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-5 border-t border-[#111520] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-bold text-xs">
                    RD
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-xs">Rohan Deshmukh</p>
                    <span className="text-[10px] text-gray-600">Super Admin</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-rose-400">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── Main Panel ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-[64px] bg-[#08090c]/80 backdrop-blur-xl border-b border-[#111520] flex items-center justify-between px-5 lg:px-7 z-30 sticky top-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white p-1"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="relative hidden md:block w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search leads, properties, deals..."
                  className="w-full bg-[#0c0e14] border border-[#151a26] rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
                />

                {/* Floating Search Results Dropdown */}
                {searchFocused && searchQuery && (
                  <div className="absolute left-0 mt-2 w-80 bg-[#0a0b0f] border border-[#151a26] rounded-2xl shadow-2xl p-3.5 z-50 text-[11px] max-h-96 overflow-y-auto space-y-3">
                    {!hasSearchResults ? (
                      <p className="text-gray-500 text-center py-2">No results found for "{searchQuery}"</p>
                    ) : (
                      <>
                        {matchingLeads.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-600 font-bold block mb-1">Matching Leads</span>
                            <div className="space-y-1">
                              {matchingLeads.map(l => (
                                <Link
                                  key={l.id}
                                  href={`/leads?search=${encodeURIComponent(l.id)}`}
                                  className="flex justify-between items-center p-2 hover:bg-[#11131a] rounded-lg transition-colors border border-transparent hover:border-[#1c2230]"
                                >
                                  <span className="font-semibold text-white truncate max-w-[150px]">{l.name}</span>
                                  <span className="text-[9px] text-brand-400 font-mono">{l.id}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchingProperties.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-600 font-bold block mb-1">Matching Properties</span>
                            <div className="space-y-1">
                              {matchingProperties.map(p => (
                                <Link
                                  key={p.id}
                                  href={`/properties?search=${encodeURIComponent(p.unitNumber)}`}
                                  className="flex justify-between items-center p-2 hover:bg-[#11131a] rounded-lg transition-colors border border-transparent hover:border-[#1c2230]"
                                >
                                  <span className="font-semibold text-white truncate max-w-[150px]">{p.project} · {p.unitNumber}</span>
                                  <span className="text-[9px] text-emerald-400 font-medium">{p.location.split(" ")[0]}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchingDeals.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-600 font-bold block mb-1">Active Deals</span>
                            <div className="space-y-1">
                              {matchingDeals.map(d => (
                                <Link
                                  key={d.id}
                                  href={`/deals?search=${encodeURIComponent(d.id)}`}
                                  className="flex justify-between items-center p-2 hover:bg-[#11131a] rounded-lg transition-colors border border-transparent hover:border-[#1c2230]"
                                >
                                  <span className="font-semibold text-white truncate max-w-[150px]">{d.leadName}</span>
                                  <span className="text-[9px] text-amber-400 font-mono">{d.id}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Clock */}
              <span className="hidden sm:inline text-[11px] text-gray-600 bg-[#0c0e14] border border-[#151a26] px-3 py-1.5 rounded-lg font-mono">
                IST <span className="text-gray-400 font-semibold">{clock}</span>
              </span>

              {/* WebSocket Status */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] border font-medium transition-all duration-300 ${
                  wsConnected
                    ? "bg-emerald-950/15 text-emerald-500 border-emerald-500/15"
                    : "bg-amber-950/15 text-amber-400 border-amber-500/15 animate-pulse"
                }`}
              >
                <Radio className={`w-3 h-3 ${wsConnected ? "" : "animate-pulse"}`} />
                <span className="hidden sm:inline">{wsConnected ? "Live" : "..."}</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-500 hover:text-white p-2 rounded-xl hover:bg-[#0f1117] transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-black font-bold text-[8px] rounded-full flex items-center justify-center border-2 border-[#08090c]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#151a26] bg-[#0a0b0f] shadow-2xl p-4 z-50"
                      >
                        <div className="flex items-center justify-between border-b border-[#111520] pb-3 mb-3">
                          <h3 className="font-semibold text-white text-xs">Notifications</h3>
                          <button
                            onClick={() =>
                              setNotifications(notifications.map((n) => ({ ...n, unread: false })))
                            }
                            className="text-[10px] text-brand-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-2.5 rounded-xl text-xs transition-all ${
                                notification.unread
                                  ? "bg-brand-950/15 border-l-2 border-brand-500"
                                  : "bg-[#0f1117]/30"
                              }`}
                            >
                              <p className="text-gray-300 leading-relaxed">{notification.text}</p>
                              <span className="text-[9px] text-gray-600 block mt-1">{notification.time}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2.5 border-l border-[#111520] pl-3">
                <span className="hidden sm:inline text-right">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold leading-none">Pune</p>
                  <p className="text-[10px] text-brand-500 font-semibold mt-0.5">Hinjewadi HQ</p>
                </span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#151a26] to-[#1e2538] border border-[#252d40] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                  RD
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Route Content */}
          <main className="flex-1 p-5 lg:p-7 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
