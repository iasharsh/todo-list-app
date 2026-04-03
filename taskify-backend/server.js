const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, title: "HELLO FROM API", status: "active", completed: false }
];

// GET
app.get("/todos", (req, res) => {
  res.json(todos);
});

// POST
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    status: req.body.status || "active",
    completed: false,
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

app.listen(5000, () => console.log("Server running on port 5000"));