import { useState, useEffect } from 'react'
import './index.css'
import { v4 as uuidv4 } from 'uuid'
import { arrayMove } from "@dnd-kit/sortable"
import toast, { Toaster } from 'react-hot-toast'
import { Typewriter } from 'react-simple-typewriter'
import { Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import TasksPage from "./components/TasksPage";
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
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/tasks" element={
          <TasksPage
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
            todo={todo}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleKeyDown={handleKeyDown}
          />
        } />
      </Routes>

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