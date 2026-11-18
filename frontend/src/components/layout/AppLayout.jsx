import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  PanelRightClose,
  PanelRightOpen,
  House,
  ArrowRightLeft,
  Tag,
  Wallet,
  FileChartLine,
  CircleUserRound,
  LogOut,
} from "lucide-react";

import logo from "/src/assets/fintrack_logo.png";

const navItems = [
  { to: "/", label: "Dashboard", icon: House, end: true },
  { to: "/transactions", label: "Transactions", icon: ArrowRightLeft },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileChartLine },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setExpanded(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
    ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
    }`;

  const iconNavClass = ({ isActive }) =>
    `flex items-center justify-center rounded-lg p-2.5 transition-colors
    ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
    }`;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <aside
        className={`relative flex shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900/50 transition-all duration-300 ${
          expanded ? "w-64 px-4 py-5" : "w-16 px-2 py-5"
        }`}
      >
        <div>
          <div
            className={
              expanded
                ? "flex items-center justify-between"
                : "flex flex-col items-center gap-2"
            }
          >
            {expanded ? (
              <div className="flex items-center gap-2.5">
                <img
                  src={logo}
                  alt="logo"
                  className="h-9 w-9 rounded-full border border-emerald-400"
                />
                <span className="text-xl font-bold tracking-wide text-emerald-400">
                  FinTrack
                </span>
              </div>
            ) : (
              <img
                src="/src/assets/fintrack_logo.png"
                alt="logo"
                className="mx-auto h-8 w-8 rounded-full border border-emerald-400"
              />
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <PanelRightOpen size={18} />
              ) : (
                <PanelRightClose size={18} />
              )}
            </button>
          </div>

          <nav
            className={`mt-6 flex flex-col ${expanded ? "gap-1" : "gap-1.5"}`}
          >
            {navItems.map(({ to, label, icon: Icon, end }) =>
              expanded ? (
                <NavLink key={to} to={to} end={end} className={navClass}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={iconNavClass}
                  title={label}
                >
                  <Icon size={20} />
                </NavLink>
              ),
            )}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4">
          {expanded ? (
            <div className="flex items-center justify-between">
              <span
                className="truncate text-xs text-slate-400"
                title={user?.email}
              >
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="shrink-0 text-xs font-semibold text-red-400 transition-colors hover:text-red-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div title={user?.email}>
                <CircleUserRound size={20} className="text-slate-400" />
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="text-red-400 transition-colors hover:text-red-300"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
