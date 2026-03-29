import React from 'react'
import { RiMoonLine } from "react-icons/ri";
import { RiSunLine } from "react-icons/ri";

const Navbar = ({ page, setPage, theme, toggleTheme }) => {
  return (
    <nav className="flex justify-between items-center 
bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border)] text-[var(--text)] 
px-6 py-3 fixed top-0 left-0 right-0 z-50">

      {/* Logo */}
      <div className="logo">
        <span
          onClick={() => setPage("home")}
          className="font-bold text-xl tracking-wide cursor-pointer"
        >
          Taskify
        </span>
      </div>

      {/* Menu */}
      <ul className="flex gap-8 items-center text-sm font-medium">

        <li
          onClick={() => setPage("home")}
          className={`cursor-pointer transition-all duration-200 ${page === "home" ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
        >
          Home
        </li>

        <li
          onClick={() => setPage("tasks")}
          className={`cursor-pointer transition-all duration-200 ${page === "tasks" ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
        >
          Your Tasks
        </li>

        {/* THEME TOGGLE */}
        <li
          onClick={toggleTheme}
          className="cursor-pointer rounded-full px-3 py-1 text-2xl transition flex items-center gap-2 text-[var(--text)] hover:opacity-80"
        >
          {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
        </li>

      </ul>
    </nav>
  )
}

export default Navbar