const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ initial data (NO req here)
let todos = [
  {
    id: 1,
    title: "First Task",
    status: "active",
    completed: false,
    createdAt: new Date().toISOString(),
  }
];

// ✅ GET
app.get("/todos", (req, res) => {
  res.json(todos);
});

// ✅ POST (req is used ONLY here)
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    status: req.body.status || "active",
    completed: false,
    createdAt: new Date().toISOString(), // ✅ important for graph
  };

  todos.push(newTodo);
  res.json(newTodo);
});

// ✅ DELETE
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ message: "Deleted" });
});

// ✅ PATCH
app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.map(t =>
    t.id === id ? { ...t, ...req.body } : t
  );
  res.json({ message: "Updated" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});