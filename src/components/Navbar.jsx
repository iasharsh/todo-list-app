import React from 'react'
import { RiMoonLine } from "react-icons/ri";
import { RiSunLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation(); // ✅ to detect current page

  return (
    <nav className="flex justify-between items-center 
bg-(--card)/80 backdrop-blur-md border-b border-[var(--border)] text-[var(--text)] 
px-6 py-3 fixed top-0 left-0 right-0 z-50">

      {/* Logo */}
      <div className="logo">
        <Link
          to="/"
          className="font-bold text-xl tracking-wide cursor-pointer"
        >
          Taskify
        </Link>
      </div>

      {/* Menu */}
      <ul className="flex gap-8 items-center text-sm font-medium">

        <li>
          <Link
            to="/"
            className={`transition-all duration-200 ${
              location.pathname === "/"
                ? "text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/tasks"
            className={`transition-all duration-200 ${
              location.pathname === "/tasks"
                ? "text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Your Tasks
          </Link>
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

export default Navbar;