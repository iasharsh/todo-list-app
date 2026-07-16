const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// initial data
let todos = [
  {
    id: 1,
    title: "First Task",
    status: "active",
    completed: false,
    createdAt: new Date().toISOString(),
  }
];

let columnOrder = ["active", "review", "completed"];
// GET COLUMN ORDER
app.get("/columns", (req, res) => {
  res.json(columnOrder);
});

// UPDATE COLUMN ORDER
app.patch("/columns", (req, res) => {
  columnOrder = req.body;
  res.json({ message: "Column order updated" });
});

// GET
app.get("/todos", (req, res) => {
  const sortedTodos = todos.sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sortedTodos);
});

// POST
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    status: req.body.status || "active",
    completed: false,
    createdAt: new Date().toISOString(),
    order: Date.now(), // ✅ ADD THIS
  };

  todos.push(newTodo);
  res.json(newTodo);
});

// DELETE
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ message: "Deleted" });
});

// PATCH
app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.map(t =>
    t.id === id ? { ...t, ...req.body } : t
  );
  res.json({ message: "Updated" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});