const AddTodo = ({ todo, handleChange, handleAdd, handleKeyDown }) => {
  return (
    <div className="addTodo my-5 flex flex-col items-start gap-3 w-full">
      <h2 className='text-lg font-semibold'>Add a Todo</h2>
      <input
        id="todo-input"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={todo}
        type="text"
        className="w-full bg-[var(--card)] text-[var(--text)] border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your task..."
      />
      <button
        onClick={handleAdd}
        className='w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 text-white py-2 rounded-lg font-semibold cursor-pointer'
      >
        Save
      </button>
    </div>
  );
};

export default AddTodo;