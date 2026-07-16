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

  // FETCH TODOS
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/todos");
      const data = await res.json();

      const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTodos(sorted);
    } catch {
      toast.error("Failed to sync todos");
    }
  };
  const fetchColumns = async () => {
    try {
      const res = await fetch("http://localhost:5000/columns");
      const data = await res.json();
      setColumnOrder(data);
    } catch {
      toast.error("Failed to load columns");
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchColumns();
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark")

  const isDuplicate = (text, id = null) => {
    return todos.some(item => item.title?.toLowerCase() === text.toLowerCase() && item.id !== id)
  }

  // ADD
  const handleAdd = async () => {
    if (todo.trim() === '') return;
    if (isDuplicate(todo)) {
      toast.error("Todo Already exists!");
      return;
    }

    await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo, status: "active" }),
    });

    setTodo('');
    fetchTodos();
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

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  }

  // UPDATE
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

    setIsModalOpen(false);
    setEditId(null);
    setEditText('');

    fetchTodos();
  }

  // DRAG
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeItemId = active.id;
    const overId = over.id;
    if (activeItemId === overId) return;

    const activeItem = todos.find(t => t.id === activeItemId);
    const columns = ["active", "review", "completed"];
    const isOverColumn = columns.includes(overId);

    // MOVE TO COLUMN
    if (isOverColumn) {
      await fetch(`http://localhost:5000/todos/${activeItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: overId,
          order: Date.now(),
        }),
      });

      fetchTodos();
      return;
    }

    const overItem = todos.find(t => t.id === overId);
    if (!overItem) return;

    // SAME COLUMN REORDER
    if (activeItem.status === overItem.status) {
      const sameColumn = todos.filter(t => t.status === activeItem.status);

      const oldIndex = sameColumn.findIndex(t => t.id === activeItemId);
      const newIndex = sameColumn.findIndex(t => t.id === overId);

      const reordered = arrayMove(sameColumn, oldIndex, newIndex);

      await Promise.all(
        reordered.map((todo, index) =>
          fetch(`http://localhost:5000/todos/${todo.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: index }),
          })
        )
      );

      fetchTodos();
    } else {
      // MOVE BETWEEN COLUMNS
      await fetch(`http://localhost:5000/todos/${activeItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: overItem.status,
          order: Date.now(),
        }),
      });

      fetchTodos();
    }
  };

  const handleColumnDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let overId = over.id;

    if (!columnOrder.includes(overId)) {
      const overTodo = todos.find(t => t.id === overId);
      if (overTodo) {
        overId = overTodo.status;
      } else return;
    }

    const updated = arrayMove(
      columnOrder,
      columnOrder.indexOf(active.id),
      columnOrder.indexOf(overId)
    );

    setColumnOrder(updated);

    // SEND TO BACKEND
    await fetch("http://localhost:5000/columns", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
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