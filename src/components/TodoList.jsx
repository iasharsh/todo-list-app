import { useEffect, useState } from "react";
import { getTodos, addTodo, deleteTodo, updateTodo } from "../../taskify-backend/server";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  // FETCH
  useEffect(() => {
    const loadTodos = async () => {
      const data = await getTodos();
      setTodos(data);
    };
    loadTodos();
  }, []);

  // ADD
  const handleAdd = async (text) => {
    const newTodo = await addTodo(text);
    setTodos(prev => [newTodo, ...prev]);
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // TOGGLE
  const handleToggle = async (id, completed) => {
    await updateTodo(id, { completed: !completed });

    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !completed } : t
      )
    );
  };

  return (
    <div>
      <button onClick={() => handleAdd("New Task")}>Add</button>

      {todos.map(todo => (
        <div key={todo.id}>
          <p onClick={() => handleToggle(todo.id, todo.completed)}>
            {todo.title} {todo.completed ? "✅" : ""}
          </p>

          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;