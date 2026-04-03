import { Typewriter } from 'react-simple-typewriter';
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const faqs = [
  { q: "Is my data saved?", a: "Yes! Everything is saved automatically in your browser's local storage." },
  { q: "Can I use it on mobile?", a: "Absolutely! Taskify is fully responsive and works on all devices." },
  { q: "Can I drag and reorder tasks?", a: "Yes! You can drag cards between columns and reorder columns too." },
  { q: "Is it free?", a: "100% free. No account needed, no ads, no limits." },
]

const HomePage = ({ theme, todos = [] }) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative px-4 md:px-6 pt-16 bg-[var(--bg)] text-[var(--text)] flex flex-col">

      {/* blobs */}
      <div className="absolute top-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-pink-500/20 blur-3xl rounded-full pointer-events-none"></div>

      {/* floating emojis — hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-20 left-10 text-3xl animate-float opacity-60 hidden md:block">📝</span>
        <span className="absolute top-40 right-20 text-2xl animate-float delay-200 opacity-60 hidden md:block">📌</span>
        <span className="absolute bottom-20 left-1/4 text-3xl animate-float delay-500 opacity-60 hidden md:block">📋</span>
        <span className="absolute bottom-10 right-10 text-2xl animate-float delay-700 opacity-60 hidden md:block">✅</span>
      </div>

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto flex flex-col justify-center py-8 md:py-10 min-h-[220px] md:min-h-[350px]">
        <div className="overflow-hidden">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
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
        </div>
        <p className="text-[var(--muted)] text-sm md:text-lg mb-4 md:mb-6 px-2">
          Your tasks, beautifully organized. Plan, track and complete your daily work with ease.
        </p>
      </div>

      {/* CTA Button */}
      <div className='flex justify-center z-10 mb-8 md:mb-15 -mt-8 md:-mt-14'>
        <button
          onClick={() => navigate("/tasks")}
          className="relative px-8 md:px-10 py-2.5 md:py-3 text-sm md:text-base rounded-xl bg-blue-600 text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 cursor-pointer"
        >
          Go to Your Tasks
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-0 md:px-10 mb-8 md:mb-20">
        {[
          { number: todos.length, label: "Total Tasks", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
          { number: todos.filter(t => t.status === "active").length, label: "Active Tasks", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
          { number: todos.filter(t => t.status === "review").length, label: "In Review", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
          { number: todos.filter(t => t.status === "completed").length, label: "Completed", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
        ].map(stat => (
          <div key={stat.label} className={`p-3 md:p-4 rounded-xl border text-center ${stat.bg}`}>
            <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.number}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 px-0 md:px-10 mb-8 md:mb-15">
        {[
          { icon: "⚡", title: "Fast Workflow", desc: "Add and manage tasks instantly" },
          { icon: "🧠", title: "Stay Organized", desc: "Separate active and completed tasks" },
          { icon: "🌗", title: "Dark Mode Ready", desc: "Switch themes instantly" },
        ].map(card => (
          <div key={card.title} className={`p-4 md:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${theme === "light" ? "shadow-lg shadow-gray-900/20" : "shadow-lg shadow-amber-100/20"}`}>
            <h2 className="font-semibold text-sm md:text-base">{card.icon} {card.title}</h2>
            <p className="text-xs md:text-sm text-[var(--muted)] mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Progress/Graph Section */}
      <div className="px-0 md:px-10 mb-8 md:mb-15">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">📊 Productivity Overview</h2>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 md:p-6">

          {/* bar graph */}
          <div className="flex items-end justify-center gap-2 md:gap-4 mb-4" style={{ height: "120px" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
              const count = todos.filter(t => {
                if (!t.createdAt) return false;
                return new Date(t.createdAt).getDay() === i;
              }).length;
              const max = Math.max(...["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((_, idx) =>
                todos.filter(t => t.createdAt && new Date(t.createdAt).getDay() === idx).length
              ), 1);
              const height = Math.round((count / max) * 100);
              const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-blue-500"];
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs text-[var(--muted)]">{count}</span>
                  <div
                    className={`w-full rounded-t-lg ${colors[i]} opacity-80 transition-all duration-700`}
                    style={{ height: `${height}px` }}
                  ></div>
                  <span className="text-xs text-[var(--muted)]">{day}</span>
                </div>
              );
            })}
          </div>

          {/* progress bars */}
          <div className="space-y-3 mt-4">
            {[
              { label: "Tasks Completed", value: todos.length ? Math.round((todos.filter(t => t.status === "completed").length / todos.length) * 100) : 0, color: "bg-blue-500" },
              { label: "In Review", value: todos.length ? Math.round((todos.filter(t => t.status === "review").length / todos.length) * 100) : 0, color: "bg-yellow-500" },
              { label: "Active Tasks", value: todos.length ? Math.round((todos.filter(t => t.status === "active").length / todos.length) * 100) : 0, color: "bg-purple-500" },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`${bar.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${bar.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* How it works */}
      <div className='mb-8 md:mb-15 text-center px-0 md:px-10'>
        <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>How Taskify Works?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
          {[
            { icon: "➕", title: "Add Tasks", desc: "Quickly add your daily tasks in seconds." },
            { icon: "📂", title: "Organize Tasks", desc: "Mark completed or filter your todos easily." },
            { icon: "🏁", title: "Achieve", desc: "Stay consistent and finish your goals." },
          ].map(card => (
            <div key={card.title} className={`p-4 md:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${theme === "light" ? "shadow-lg shadow-gray-700/20" : "shadow-lg shadow-amber-100/20"}`}>
              <h2 className="font-semibold text-sm md:text-lg">{card.icon} {card.title}</h2>
              <p className="text-xs md:text-sm text-[var(--muted)] mt-2">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-0 md:px-10 mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">❓ FAQ</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-4 md:px-5 py-3 md:py-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition"
              >
                <span className="font-medium text-xs md:text-sm">{faq.q}</span>
                <span className="text-[var(--muted)] text-lg ml-2 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 md:px-5 pb-3 md:pb-4 text-xs md:text-sm text-[var(--muted)]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-[var(--border)] pt-4 md:pt-6 pb-4 md:pb-6">
        <p className="text-xs md:text-sm text-[var(--muted)] mb-3">
          Made with <span className="text-yellow-400">⚡</span> React • Taskify © {new Date().getFullYear()}
        </p>
        <div className="flex justify-center gap-4 md:gap-5">
          <a href="https://www.linkedin.com/in/harsh-pandey-5970bb278/" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 hover:scale-110">
            <FaLinkedin size={16} />
          </a>
          <a href="mailto:harshpandey2634@gmail.com"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 hover:scale-110">
            <FaEnvelope size={16} />
          </a>
          <a href="https://github.com/iasharsh" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-gray-500/20 hover:text-white transition-all duration-300 hover:scale-110">
            <IoLogoGithub size={16} />
          </a>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 opacity-70">Built with passion 🚀</p>
      </div>

    </div>
  );
};

export default HomePage;