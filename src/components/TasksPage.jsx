import AddTodo from "./AddTodo";
import KanbanBoard from "./KanbanBoard";
import { Typewriter } from "react-simple-typewriter";
import { FaPlus } from "react-icons/fa";

const TasksPage = ({
  todos, activeId, columnOrder,
  handleEdit, handleDelete,
  handleDragEnd, handleColumnDragEnd,
  setActiveId, setColumnOrder,
  dragType, setDragType,
  todo, handleChange, handleAdd, handleKeyDown
}) => {
  return (
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
          <h2
            onClick={() => document.getElementById('todo-input')?.focus()}
            className="flex items-center gap-2 text-lg font-semibold mb-3"
          >
            <FaPlus size={14} className="text-blue-400 cursor-pointer" />  {/* ✅ visible */}

            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
              Add a Task
            </span>
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
  );
};

export default TasksPage;