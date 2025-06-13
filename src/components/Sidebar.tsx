// src/components/Sidebar.tsx
import React, { useState } from "react";
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Activity,
  ClipboardList,
  Trophy,
  MapPin,
  Target,
  Settings as SettingsIcon,
} from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";

// Nav items
const navItems: {
  label: string;
  icon: React.ReactNode;
  href: string;
}[] = [
  { label: "Team Overview",      icon: <LayoutDashboard size={18} />, href: "#" },
  { label: "Battle Stats",       icon: <Activity size={18} />,        href: "#" },
  { label: "Pokémon Collection", icon: <ClipboardList size={18} />,  href: "#" },
  { label: "Training Log",       icon: <ClipboardList size={18} />,  href: "#" },
  { label: "Achievements",       icon: <Trophy size={18} />,          href: "#" },
  { label: "Gym Leaders",        icon: <MapPin size={18} />,          href: "#" },
  { label: "Goals",              icon: <Target size={18} />,          href: "#" },
  { label: "Settings",           icon: <SettingsIcon size={18} />,    href: "#" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // mobile default w-16; on md+ either w-16 or w-64
  const widthClasses = `w-16 ${collapsed ? "md:w-16" : "md:w-64"}`;

  return (
    <aside
      className={
        "z-50 flex fixed inset-y-0 left-0 flex-col " +
        "bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 " +
        "transition-width duration-200 " +
        widthClasses
      }
    >
      {/* Logo + collapse (toggle hidden on sm) */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap size={24} className="text-yellow-500" />
          {/* label hidden on mobile, always hidden if collapsed */}
          {!collapsed && <span className="hidden md:inline text-xl font-bold">PokeTracker</span>}
        </div>
        {/* only show toggle on md+ */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden md:block p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto">
        {navItems.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-2 px-4 py-3 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {icon}
            {/* label only on md+ and when not collapsed */}
            {!collapsed && <span className="hidden md:inline">{label}</span>}
          </a>
        ))}
      </nav>

      {/* Dark-mode toggle on md+ only */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        {!collapsed && <DarkModeToggle />}
      </div>
    </aside>
  );
}
