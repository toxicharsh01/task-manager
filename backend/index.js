const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const connectDB = require("./utils/db"); // DB connection
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Middlewares to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.use("/api/v1/users", userRoutes);

// Task routes
app.use("/api/v1/tasks", taskRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
