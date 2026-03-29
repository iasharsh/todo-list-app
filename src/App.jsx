import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { ImCross } from "react-icons/im";
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from 'react-simple-typewriter'
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [ShowFinished, setShowFinished] = useState(true)
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editText, setEditText] = useState('')
  const [page, setPage] = useState("home")
  const [theme, setTheme] = useState("dark")
  const [view, setView] = useState("all")

  // Load firstlocalStorage
  useEffect(() => {
    let todoString = localStorage.getItem('todos')
    if (todoString) {
      const parsed = JSON.parse(todoString)
      const clean = parsed.filter(item => item && item.id)
      setTodos(clean)
    }
  }, [])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector("input[placeholder='Update your task...']")?.focus();
    }
  }, [isModalOpen])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);


  // Save helper
  const saveTOLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const isDuplicate = (text, id = null) => {
    return todos.some(
      item =>
        item.todo.toLowerCase() === text.toLowerCase() &&
        item.id !== id
    );
  };

  const handleModalUpdate = () => {
    if (editText.trim() === '') return;

    if (isDuplicate(editText, editId)) {
      toast.error("Todo Already exists!");
      return;
    }

    const newTodos = todos.map(item =>
      item.id === editId
        ? {
          ...item,
          todo: editText,
          isCompleted: item.isCompleted
        }
        : item
    );
    setTodos(newTodos);
    saveTOLS(newTodos);

    setIsModalOpen(false);
    setEditId(null);
    setEditText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && todo.trim() !== '') {
      handleAdd()
    }
  }

  // Toggle finished filter
  const toggleFinished = () => {
    setShowFinished(prev => !prev)
  }

  // Edit (ONLY fills input, no delete, no save)
  const handleEdit = (id) => {
    let t = todos.find(item => item.id === id)
    if (!t) return

    setEditText(t.todo)
    setEditId(id)   // track editing
    setIsModalOpen(true)
  }

  // Delete
  const handleDelete = (id) => {
    let temp = todos.filter(item => item.id !== id)
    setTodos(temp)
    saveTOLS(temp)
  }

  // Add
  const handleAdd = () => {
    if (todo.trim() === '') return;

    if (isDuplicate(todo)) {
      toast.error("Todo Already exists!");
      return;
    }

    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }]
    setTodos(newTodos)
    saveTOLS(newTodos)
    setTodo('')
  }


  // Input change
  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  // Checkbox toggle
  const handleCheckbox = (e) => {
    let id = e.target.name;
    let idx = todos.findIndex(item => item.id === id)

    let temp = [...todos]
    temp[idx].isCompleted = !temp[idx].isCompleted

    setTodos(temp)
    saveTOLS(temp)
  }

  return (
    <>
      <div>

        <Toaster position="top-right" reverseOrder={false} />

        <Navbar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />
        {page === "home" && (

          <div className="pt-24 px-6 min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--text)] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[400px] bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* HERO */}
            <div className="text-center max-w-2xl mx-auto">

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ✏️ <span className="text-blue-500">Taskify</span>{" "}
                <Typewriter
                  words={[
                    'Turn chaos into clarity...',
                    'Organize your tasks...',
                    'Boost your productivity...'
                  ]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </h1>

              <p className="text-[var(--muted)] text-lg mb-6">
                Your tasks, beautifully organized. Plan, track and complete your daily work with ease. Everything is saved automatically in your browser.
              </p>

              {/* <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-7 italic">
                This is a simple todo app built with React. You can add, edit, and delete your tasks,
                and toggle between light and dark themes. Your tasks are saved in local storage,
                so they will be here when you come back.
              </p> */}

              <button type='button'
                onClick={() => setPage("tasks")}
                className="relative px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
overflow-hidden transition-all duration-300
hover:scale-105 active:scale-95
before:absolute before:inset-0 before:bg-white/20
before:translate-x-[-100%] hover:before:translate-x-[100%]
before:transition-transform before:duration-700 cursor-pointer"
              >
                Go to Your Tasks
              </button>

            </div>

            {/* FEATURE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-11">

              <div className={`group p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                <h2 className="font-semibold">⚡ Fast Workflow</h2>
                <p className="text-sm text-[var(--muted)] mt-2">
                  Add and manage tasks instantly
                </p>
              </div>

              <div className={`group p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                <h2 className="font-semibold">🧠 Stay Organized</h2>
                <p className="text-sm text-[var(--muted)] mt-2">
                  Separate active and completed tasks
                </p>
              </div>

              <div className={`group p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                <h2 className="font-semibold">🌗 Dark Mode Ready</h2>
                <p className="text-sm text-[var(--muted)] mt-2">
                  Switch themes instantly
                </p>
              </div>

            </div>

            <div className='mt-15 text-center'>
              <h2 className='text-2xl font-bold mb-10 text-center'>How Taskify Works?</h2>

              <div className='grid md:grid-cols-3 gap-6'>
                <div className={`p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300  cursor-pointer 
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                  <h2 className="font-semibold text-lg">➕ Add Tasks</h2>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    Quickly add your daily tasks in seconds.
                  </p>
                </div>
                <div className={`p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300  cursor-pointer
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                  <h2 className="font-semibold text-lg">📂 Organize Tasks</h2>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    Mark completed or filter your todos easily.
                  </p>
                </div>
                <div className={`p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300  cursor-pointer
                ${theme === "light" ? "shadow-gray-700" : "shadow-amber-100"}`}>
                  <h2 className="font-semibold text-lg">🏁 Achieve</h2>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    Stay consistent and finish your goals.
                  </p>
                </div>

              </div>
            </div>
            <div className="mt-24 text-center text-sm text-[var(--muted)] border-t border-[var(--border)] pt-6">
              <p>
                Made with ⚡ React • Taskify © {new Date().getFullYear()}
              </p>
              <div className="flex justify-center gap-6 text-sm mt-2 text-[var(--muted)]">

                <a
                  href="https://www.linkedin.com/in/harsh-pandey-5970bb278/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition"
                >
                  <FaLinkedin size={17} />
                </a>

                <a
                  href="mailto:harshpandey2634@gmail.com"
                  className="hover:text-red-400 transition"
                >
                  <FaEnvelope size={17} />
                </a>

              </div>
            </div>

          </div>
        )}


        {page === "tasks" && (
          <div className="container mx-auto mt-20 rounded-2xl p-6 min-h-[80vh] border shadow-lg bg-[var(--card)] text-[var(--text)] border border-[var(--border)]">

            <h1 className='font-bold flex items-center justify-center text-2xl mb-6'>
              Taskify - Manage Your Todos At One Place
            </h1>

            <div className="addTodo my-5 flex flex-col items-start gap-3 w-full">
              <h2 className='text-lg font-semibold'>Add a Todo</h2>

              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={todo}
                type="text"
                className="w-full bg-[var(--card)] text-[var(--text)] border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your task..."
              />

              <button
                onClick={handleAdd}
                className='w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 text-white py-2 rounded-lg font-semibold cursor-pointer'>
                Save
              </button>
            </div>

            <div className="mt-6">

              <label className="flex items-center gap-2 text-sm text-[var(--muted)] mb-3">
                <input
                  type="checkbox"
                  checked={ShowFinished}
                  onChange={toggleFinished}
                  className="accent-blue-500 cursor-pointer"
                />
                Show Finished Todos
              </label>

              <h2 className='text-lg font-semibold mb-3'>Your Todos</h2>

              <div className="todos space-y-2">
                {todos.length === 0 && (
                  <div className='text-gray-500'>📝 No todos yet — add your first task!</div>
                )}

                {todos
                  .filter(item => item && item.id)
                  .map(item => (
                    (ShowFinished || !item.isCompleted) && (

                      <div
                        key={item.id}
                        className="todo flex w-full justify-between items-center bg-[var(--card)] border border-[var(--border)]
text-[var(--text)] border  px-4 py-3 rounded-xl hover:bg-[var(--bg)] transition-all cursor-pointer">

                        <div className="flex gap-4 items-start w-full">

                          <input
                            onChange={handleCheckbox}
                            type="checkbox"
                            checked={item.isCompleted}
                            name={item.id}
                            className="mt-1 accent-blue-500 cursor-pointer"
                          />

                          <div className={`wrap-break-word max-w-[80%] ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
                            {item.todo}
                          </div>

                        </div>

                        <div className="buttons flex gap-2 ml-3">

                          <button
                            onClick={() => handleEdit(item.id)}
                            className='bg-[var(--card)] text-[var(--text)] hover:bg-[var(--bg)] p-2 rounded-md transition cursor-pointer'>
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-[var(--card)] text-red-500 hover:bg-[var(--bg)] p-32 rounded-md transition cursor-pointer flex items-center justify-center"
                          >
                            <MdDeleteForever className="text-xl" />
                          </button>

                        </div>

                      </div>
                    )
                  ))}
              </div>
            </div>
          </div>
        )}


        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-[92%] max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl transform transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  ✏️ Edit Todo
                </h2>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--muted)] hover:text-red-400 transition cursor-pointer"
                >
                  <ImCross size={12} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleModalUpdate()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleModalUpdate();
                  }}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl text-[var(--text)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                  placeholder="Update your task..."
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-5 pb-5">

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg)] hover:opacity-80 text-[var(--text)] transition cursor-pointer border border-[var(--border)]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleModalUpdate}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-blue-500/30 transition cursor-pointer"
                >
                  Update
                </button>

              </div>

            </div>
          </div>
        )}

      </div >

    </>
  )
}

export default App