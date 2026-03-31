import { Typewriter } from 'react-simple-typewriter';
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const HomePage = ({ theme }) => {
  const navigate = useNavigate();
  return (
    <div className="relative pt-15 px-6 min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

      {/* blobs */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-pink-500/20 blur-3xl rounded-full pointer-events-none"></div>

      {/* floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-20 left-10 text-3xl animate-float opacity-60 hidden md:block">📝</span>
        <span className="absolute top-40 right-20 text-2xl animate-float delay-200 opacity-60 hidden md:block">📌</span>
        <span className="absolute bottom-20 left-1/4 text-3xl animate-float delay-500 opacity-60 hidden md:block">📋</span>
        <span className="absolute bottom-10 right-10 text-2xl animate-float delay-700 opacity-60 hidden md:block">✅</span>
      </div>

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto h-auto md:h-[250px] flex flex-col justify-center py-10 md:py-0">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          ✏️ <span className="text-blue-500">Taskify</span>{" "}
          <Typewriter
            words={['Turn chaos into clarity...', 'Organize your tasks...', 'Boost your productivity...']}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h1>
        <p className="text-[var(--muted)] text-base md:text-lg mb-6 px-2">
          Your tasks, beautifully organized. Plan, track and complete your daily work with ease.
        </p>
      </div>

      {/* CTA Button */}
      <div className='flex justify-center z-10'>
        <button
          onClick={() => navigate("/tasks")}
          className="relative px-15 py-3 rounded-xl bg-blue-600 text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 cursor-pointer"
        >
          Go to Your Tasks
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 md:mt-11 px-10">
        {[
          { icon: "⚡", title: "Fast Workflow", desc: "Add and manage tasks instantly" },
          { icon: "🧠", title: "Stay Organized", desc: "Separate active and completed tasks" },
          { icon: "🌗", title: "Dark Mode Ready", desc: "Switch themes instantly" },
        ].map(card => (
          <div key={card.title} className={`p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${theme === "light" ? "shadow-gray-900/20" : "shadow-amber-100"}`}>
            <h2 className="font-semibold">{card.icon} {card.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className='mt-6 text-center'>
        <h2 className='text-2xl font-bold mb-10'>How Taskify Works?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 md:mt-11 px-10'>
          {[
            { icon: "➕", title: "Add Tasks", desc: "Quickly add your daily tasks in seconds." },
            { icon: "📂", title: "Organize Tasks", desc: "Mark completed or filter your todos easily." },
            { icon: "🏁", title: "Achieve", desc: "Stay consistent and finish your goals." },
          ].map(card => (
            <div key={card.title} className={`p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
              <h2 className="font-semibold text-lg">{card.icon} {card.title}</h2>
              <p className="text-sm text-[var(--muted)] mt-2">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center border-t border-[var(--border)] pt-6">

        {/* Text */}
        <p className="text-sm text-[var(--muted)] mb-3">
          Made with <span className="text-yellow-400">⚡</span> React • Taskify © {new Date().getFullYear()}
        </p>

        {/* Icons */}
        <div className="flex justify-center gap-5">

          <a
            href="https://www.linkedin.com/in/harsh-pandey-5970bb278/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 
                 hover:bg-blue-500/20 hover:text-blue-400 
                 transition-all duration-300 hover:scale-110"
          >
            <FaLinkedin size={18} />
          </a>

          <a
            href="mailto:harshpandey2634@gmail.com"
            className="p-2 rounded-full bg-white/5 border border-white/10 
                 hover:bg-red-500/20 hover:text-red-400 
                 transition-all duration-300 hover:scale-110"
          >
            <FaEnvelope size={18} />
          </a>

          <a
            href="https://github.com/iasharsh"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 
                 hover:bg-gray-500/20 hover:text-white 
                 transition-all duration-300 hover:scale-110"
          >
            <IoLogoGithub size={18} />
          </a>

        </div>

        {/* Optional subtle line */}
        <p className="text-xs text-[var(--muted)] mt-4 opacity-70">
          Built with passion 🚀
        </p>

      </div>

    </div>
  );
};

export default HomePage;