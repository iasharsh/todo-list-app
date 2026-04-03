import { useState, useEffect } from 'react'
import './index.css'
import { arrayMove } from "@dnd-kit/sortable"
import toast, { Toaster } from 'react-hot-toast'
import { Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import TasksPage from "./components/TasksPage";
import EditModal from './components/EditModal'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editText, setEditText] = useState('')
  const [theme, setTheme] = useState("dark")
  const [activeId, setActiveId] = useState(null)
  const [columnOrder, setColumnOrder] = useState(["active", "review", "completed"])
  const [dragType, setDragType] = useState(null)

  // ✅ FETCH TODOS FROM API
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(() => toast.error("Failed to load todos"));
  }, [])

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark")

  const isDuplicate = (text, id = null) => {
    return todos.some(item => item.title?.toLowerCase() === text.toLowerCase() && item.id !== id)
  }

  // ✅ ADD TODO (API)
  const handleAdd = async () => {
    if (todo.trim() === '') return;
    if (isDuplicate(todo)) {
      toast.error("Todo Already exists!");
      return;
    }

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo, status: "active" }),
    });

    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setTodo('');
  }

  const handleChange = (e) => setTodo(e.target.value)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && todo.trim() !== '') handleAdd()
  }

  const handleEdit = (id) => {
    const t = todos.find(item => item.id === id)
    if (!t) return
    setEditText(t.title)
    setEditId(id)
    setIsModalOpen(true)
  }

  // ✅ DELETE TODO (API)
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(prev => prev.filter(item => item.id !== id));
  }

  // ✅ UPDATE TODO (API)
  const handleModalUpdate = async () => {
    if (editText.trim() === '') return;
    if (isDuplicate(editText, editId)) {
      toast.error("Todo Already exists!");
      return;
    }

    await fetch(`http://localhost:5000/todos/${editId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editText }),
    });

    const newTodos = todos.map(item =>
      item.id === editId ? { ...item, title: editText } : item
    );

    setTodos(newTodos);
    setIsModalOpen(false);
    setEditId(null);
    setEditText('');
  }

  // 🔥 DRAG LOGIC (UNCHANGED)
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
      setTodos([...others, ...reordered]);
    } else {
      const withoutActive = todos.filter(t => t.id !== activeItemId);
      const overIndex = withoutActive.findIndex(t => t.id === overId);
      const updated = [
        ...withoutActive.slice(0, overIndex + 1),
        { ...activeItem, status: overItem.status },
        ...withoutActive.slice(overIndex + 1),
      ];
      setTodos(updated);
    }
  }

  const handleColumnDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let overId = over.id;

    if (!columnOrder.includes(overId)) {
      const overTodo = todos.find(t => t.id === overId);
      if (overTodo) {
        overId = overTodo.status;
      } else return;
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
      <Toaster position="top-right" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<HomePage theme={theme} todos={todos} />} />

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

export default App;