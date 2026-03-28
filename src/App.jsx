import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { ImCross } from "react-icons/im";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [ShowFinished, setShowFinished] = useState(true)
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editText, setEditText] = useState('')

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
    if(isModalOpen){
      document.querySelector("input[placeholder='Update your task...']")?.focus();
    }
  }, [isModalOpen])
  


  // Save helper
  const saveTOLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

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
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <div className="container mx-auto mt-20 rounded-2xl p-6 bg-[#0f1419] min-h-[80vh] text-gray-100 border border-gray-800 shadow-lg">

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
            className='w-full bg-[#16181c] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="Enter your task..."
          />

          <button
            onClick={handleAdd}
            className='w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 text-white py-2 rounded-lg font-semibold cursor-pointer'>
            Save
          </button>
        </div>

        <div className="mt-6">

          <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
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
                    className="todo flex w-full justify-between items-center bg-[#16181c] border border-gray-800 px-4 py-3 rounded-xl hover:bg-[#1d1f23] transition-all cursor-pointer">

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
                        className='bg-gray-800 hover:bg-gray-700 p-2 rounded-md transition cursor-pointer'>
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className='bg-red-600/80 hover:bg-red-500 p-2 rounded-md transition text-white cursor-pointer'>
                        <MdDeleteForever />
                      </button>

                    </div>

                  </div>
                )
              ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >

          <div className="w-[92%] max-w-md rounded-2xl bg-[#111318] border border-gray-800 shadow-2xl transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-gray-200">
                ✏️ Edit Todo
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-400 transition cursor-pointer"
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
                  if (e.key === "Enter") {
                    handleModalUpdate();
                  }
                }}
                className="w-full bg-[#0b0d10] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                placeholder="Update your task..."
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 pb-5">

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition cursor-pointer"
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
    </>
  )
}

export default App