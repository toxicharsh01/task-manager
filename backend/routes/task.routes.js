const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

// Task routes (all protected with auth middleware)

// Create task
router.post("/", auth, createTask);
// Get all tasks for user
router.get("/", auth, getTasks);
// Get single task
router.get("/:id", auth, getTask);
// Update task
router.patch("/:id", auth, updateTask);
// Delete task
router.delete("/:id", auth, deleteTask);

module.exports = router;
