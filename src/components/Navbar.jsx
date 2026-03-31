import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Your Tasks", path: "/tasks" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
      px-4 md:px-8 py-3 md:py-4 bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border)]">

      {/* Logo */}
      <div className="text-lg md:text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        ✏️ Taskify
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        {navLinks.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`hover:text-blue-400 transition cursor-pointer
              ${location.pathname === link.path ? "text-blue-400 font-semibold" : "text-[var(--muted)]"}`}
          >
            {link.label}
          </button>
        ))}
        <button onClick={toggleTheme} className="cursor-pointer text-lg">
          {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
        </button>
      </div>

      {/* Mobile right side — theme + hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <button onClick={toggleTheme} className="cursor-pointer text-lg">
          {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
        </button>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="cursor-pointer text-[var(--text)] p-1"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden
          bg-[var(--card)]/95 backdrop-blur-md border-b border-[var(--border)]
          flex flex-col py-3 px-4 gap-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              className={`text-left py-2 px-3 rounded-lg transition cursor-pointer text-sm
                ${location.pathname === link.path
                  ? "text-blue-400 font-semibold bg-blue-500/10"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5"}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

    </nav>
  );
};

export default Navbar;