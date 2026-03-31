import { useState, useEffect } from 'react'
import './index.css'
import { v4 as uuidv4 } from 'uuid'
import { arrayMove } from "@dnd-kit/sortable"
import toast, { Toaster } from 'react-hot-toast'
import { Typewriter } from 'react-simple-typewriter'

import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import AddTodo from './components/AddTodo'
import EditModal from './components/EditModal'
import KanbanBoard from './components/KanbanBoard'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editText, setEditText] = useState('')
  const [page, setPage] = useState("home")
  const [theme, setTheme] = useState("dark")
  const [activeId, setActiveId] = useState(null)
  const [columnOrder, setColumnOrder] = useState(["active", "review", "completed"])
  const [dragType, setDragType] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('todos')
    if (stored) {
      const clean = JSON.parse(stored).filter(item => item && item.id)
      setTodos(clean)
    }
  }, [])

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const saveTOLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark")

  const isDuplicate = (text, id = null) => {
    return todos.some(item => item.todo.toLowerCase() === text.toLowerCase() && item.id !== id)
  }

  const handleAdd = () => {
    if (todo.trim() === '') return;
    if (isDuplicate(todo)) { toast.error("Todo Already exists!"); return; }
    const newTodos = [...todos, { id: uuidv4(), todo, status: "active" }]
    setTodos(newTodos)
    saveTOLS(newTodos)
    setTodo('')
  }

  const handleChange = (e) => setTodo(e.target.value)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && todo.trim() !== '') handleAdd()
  }

  const handleEdit = (id) => {
    const t = todos.find(item => item.id === id)
    if (!t) return
    setEditText(t.todo)
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    const temp = todos.filter(item => item.id !== id)
    setTodos(temp)
    saveTOLS(temp)
  }

  const handleModalUpdate = () => {
    if (editText.trim() === '') return;
    if (isDuplicate(editText, editId)) { toast.error("Todo Already exists!"); return; }
    const newTodos = todos.map(item =>
      item.id === editId ? { ...item, todo: editText } : item
    )
    setTodos(newTodos)
    saveTOLS(newTodos)
    setIsModalOpen(false)
    setEditId(null)
    setEditText('')
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeItemId = active.id;
    const overId = over.id;
    if (activeItemId === overId) return;

    const activeItem = todos.find(t => t.id === activeItemId);
    const columns = ["active", "review", "completed"];
    const isOverColumn = columns.includes(overId);

    if (isOverColumn) {
      const remaining = todos.filter(t => t.id !== activeItemId);
      const updated = [...remaining, { ...activeItem, status: overId }];
      setTodos(updated);
      saveTOLS(updated);
      return;
    }

    const overItem = todos.find(t => t.id === overId);
    if (!overItem) return;

    if (activeItem.status === overItem.status) {
      const sameColumn = todos.filter(t => t.status === activeItem.status);
      const oldIndex = sameColumn.findIndex(t => t.id === activeItemId);
      const newIndex = sameColumn.findIndex(t => t.id === overId);
      const reordered = arrayMove(sameColumn, oldIndex, newIndex);
      const others = todos.filter(t => t.status !== activeItem.status);
      const updated = [...others, ...reordered];
      setTodos(updated);
      saveTOLS(updated);
    } else {
      const withoutActive = todos.filter(t => t.id !== activeItemId);
      const overIndex = withoutActive.findIndex(t => t.id === overId);
      const updated = [
        ...withoutActive.slice(0, overIndex + 1),
        { ...activeItem, status: overItem.status },
        ...withoutActive.slice(overIndex + 1),
      ];
      setTodos(updated);
      saveTOLS(updated);
    }
  }

  const handleColumnDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let overId = over.id;

    // ✅ If dropped on a card → convert it to its column
    if (!columnOrder.includes(overId)) {
      const overTodo = todos.find(t => t.id === overId);
      if (overTodo) {
        overId = overTodo.status;
      } else {
        return;
      }
    }

    setColumnOrder(prev => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />

      {page === "home" && (
        <HomePage theme={theme} setPage={setPage} />
      )}

      {page === "tasks" && (
        <div className="relative min-h-screen pt-20 px-6 bg-[var(--bg)] text-[var(--text)] overflow-hidden">

          {/* Animated background blobs */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full pointer-events-none animate-pulse"></div>
          <div className="absolute top-40 right-0 w-[350px] h-[350px] bg-purple-500/20 blur-3xl rounded-full pointer-events-none animate-pulse delay-300"></div>
          <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-pink-500/20 blur-3xl rounded-full pointer-events-none animate-pulse delay-700"></div>
          <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-green-500/15 blur-3xl rounded-full pointer-events-none animate-pulse delay-500"></div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute top-24 left-10 text-2xl opacity-80 animate-float">📝</span>
            <span className="absolute top-40 right-20 text-xl opacity-80 animate-float delay-200">📌</span>
            <span className="absolute bottom-32 left-1/4 text-2xl opacity-80 animate-float delay-500">📋</span>
            <span className="absolute bottom-16 right-10 text-xl opacity-80 animate-float delay-700">✅</span>
            <span className="absolute top-60 left-1/2 text-xl opacity-60 animate-float delay-300">⚡</span>
            <span className="absolute top-32 right-1/3 text-xl opacity-60 animate-float delay-600">🎯</span>
          </div>

          {/* Glassmorphism main card */}
          <div className="relative z-10 container mx-auto rounded-2xl p-6 min-h-[80vh]
      border border-white/10
      bg-white/5 backdrop-blur-xl
      shadow-2xl shadow-black/30">

            {/* Styled header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">

                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ✏️ Taskify {" "}
                </span>
                <span className="text-pink-400">
                  <Typewriter
                    words={['Board...', 'Organize...', 'Conquer...']}
                    loop={true}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </h1>

              <p className="text-[var(--muted)] text-sm mt-2">
                Drag, organize and conquer your tasks
              </p>

              <div className="mx-auto mt-3 h-[2px] w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-2xl font-bold text-blue-400">
                  {todos.filter(t => t.status === "active").length}
                </p>
                <p className="text-xs text-[var(--muted)]">Active</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-2xl font-bold text-yellow-400">
                  {todos.filter(t => t.status === "review").length}
                </p>
                <p className="text-xs text-[var(--muted)]">Reviewing</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-2xl font-bold text-green-400">
                  {todos.filter(t => t.status === "completed").length}
                </p>
                <p className="text-xs text-[var(--muted)]">Completed</p>
              </div>
            </div>

            {/* Add todo — glassmorphism styled */}
            <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ➕ Add a Task
              </h2>
              <AddTodo
                todo={todo}
                handleChange={handleChange}
                handleAdd={handleAdd}
                handleKeyDown={handleKeyDown}
              />
            </div>

            {/* Kanban board */}
            <KanbanBoard
              todos={todos}
              activeId={activeId}
              columnOrder={columnOrder}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleDragEnd={handleDragEnd}
              handleColumnDragEnd={handleColumnDragEnd}
              setActiveId={setActiveId}
              setColumnOrder={setColumnOrder}
              dragType={dragType}
              setDragType={setDragType}
            />

            {/* Footer hint */}
            <div className="mt-10 text-center text-xs text-[var(--muted)] border-t border-white/10 pt-4">
              <p>✨ Drag cards between columns • Click text to expand • Drag columns to reorder</p>
            </div>

          </div>
        </div>
      )}

      <EditModal
        isModalOpen={isModalOpen}
        editText={editText}
        setEditText={setEditText}
        setIsModalOpen={setIsModalOpen}
        handleModalUpdate={handleModalUpdate}
      />
    </>
  )
}

export default App