import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API from "../utils/axios";
import styles from "./dashboard.module.css";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/Toastify";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState("");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
    },
  });

  // Fetch tasks
  const getTasks = async () => {
    try {
      let query = [];

      if (search) query.push(`search=${search}`);
      if (priority) query.push(`priority=${priority}`);
      if (date) query.push(`date=${date}`);
      if (completed) query.push(`completed=${completed}`);

      const finalQuery = query.length ? `?${query.join("&")}` : "";

      const { data } = await API.get(`/tasks${finalQuery}`);
      setTasks(data.data);
    } catch (err) {
      handleError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    if (location.state?.isLoggedIn) {
      handleSuccess("Login successful");
      navigate("/dashboard", { replace: true, state: {} });
    }
    const delay = setTimeout(() => {
      getTasks();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, priority, date, completed]);

  // Add + Update

  const onSubmit = async (data) => {
    const { title, description, priority, dueDate } = data;

    if (!title || !description || !dueDate || !priority) {
      return handleError("All fields required");
    }
    console.log(data);
    try {
      if (editId) {
        // UPDATE
        const response = await API.patch(`/tasks/${editId}`, data);
        handleSuccess(response.data.message);

       setTasks((prev) =>
  prev.map((t) => (t._id === editId ? response.data.data : t))
);
        setEditId(null);
      } else {
        // ADD
        const response = await API.post("/tasks", data);

        handleSuccess(response.data.message);

        setTasks((prev) => [...prev, response.data.data]);
      }

      // Reset form
      reset({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",
      });
    } catch (err) {
      console.log(err);
      handleError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const { data } = await API.delete(`/tasks/${id}`);

      handleSuccess(data.message || "Task deleted");

      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      handleError("Delete failed");
    }
  };

  // Edit (prefill form)

  const handleEdit = (task) => {
    setEditId(task._id);

    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
      completed: task.completed || false,
    });
  };

  // Logout
  const handleLogout = () => {
    logout();
    localStorage.setItem("logout", "ture");
    navigate("/login");
  };

  const handleCheckBox = async (task) => {
    try {
      const { data } = await API.patch(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      handleSuccess("Status updated");
      setTasks((prev) =>
        prev.map((t) => {
          return t._id === task._id ? data.data : t;
        }),
      );
    } catch (error) {
      handleError("Failed to update status");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer autoClose={2000} />
      <div className={styles.topBar}>
        <h1>Dashboard</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 className={styles.sectionTitle}>
        {editId ? "Edit Task" : "Add Task"}
      </h2>

      <form className={styles.dashboardForm} onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Title" />
        <input {...register("description")} placeholder="Description" />
        <select {...register("priority")}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="date" {...register("dueDate")} />
        <button type="submit">{editId ? "Update Task" : "Add Task"}</button>
      </form>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={completed}
          onChange={(e) => setCompleted(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <h2 className={styles.sectionTitle}>Tasks</h2>
      <div className={styles.tasksContainer}>
        {tasks.map((task) => (
          <div key={task._id} className={styles.taskCard}>
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => handleCheckBox(task)}
            />
            <h3 className={task.completed ? styles.completed : ""}>
              {task.title}
            </h3>

            <p className={task.completed ? styles.completed : ""}>
              {task.description}
            </p>
            <p>Priority: {task.priority}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.completed ? "Done" : "Pending"}</p>

            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
