const Task = require("../models/task.model");

// Create a new task
const createTask = async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;

  // Validate required fields
  if (!title || !description) {
    return res
      .status(400) // 201 was wrong for validation error
      .json({ success: false, message: "All fields are required" });
  }

  // Check if task with same title already exists for this user
  const existingTask = await Task.findOne({ title, user: user._id });
  if (existingTask) {
    return res
      .status(400)
      .json({ success: false, message: "This task already exists" });
  }

  try {
    const newTask = new Task({
      title,
      description,
      user: user._id,
    });

    await newTask.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Task added successfully",
        data: newTask,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
  const user = req.user;
  const tasks = await Task.find({ user: user._id });

  return res.status(200).json({ success: true, data: tasks });
};

// Get single task by ID
const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "Task does not exist" });
  }

  return res.status(200).json({ success: true, data: task });
};

// Update task
const updateTask = async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  // Check if updated title conflicts with another task
  if (title) {
    const existingTask = await Task.findOne({
      title,
      user: req.user._id,
      _id: { $ne: req.params.id },
    });

    if (existingTask) {
      return res
        .status(400)
        .json({ success: false, message: "This task already exists" });
    }
  }

  task.title = title || task.title;
  task.description = description || task.description;

  const updatedTask = await task.save();

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
};

// Delete task
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  await task.remove();

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task,
  });
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
