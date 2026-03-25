const Task = require("../models/task.model");

// Create a new task
const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body; // added new fields
  const user = req.user;

  console.log(user);

  // Validate required fields
  if (!title || !description || !priority || !dueDate) {
    return res
      .status(400)
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
      priority, // added
      dueDate, // added
      user: user._id,
    });

    await newTask.save();
    return res.status(201).json({
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
  try {
    const { search, priority, completed } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (priority) {
      query.priority = priority;
    }

    if (completed === "true" || completed === "false") {
      query.completed = completed === "true"; // convert string to bool
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
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
  const { title, description, priority, dueDate, completed } = req.body;
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

  // Update fields if provided
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(completed !== undefined && { completed }),
    },
    { new: true },
  );
  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    console.log(req.params.id);
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
