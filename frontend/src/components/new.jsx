import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import API from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/Toastify";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

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
      const { data } = await API.get("/tasks");
      setTasks(data.data);
    } catch (err) {
      handleError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add + Update
  const onSubmit = async (formData) => {
    const { title, description,priority, dueDate } = formData;

    if (!title || !description || !dueDate ||!priority) {
      return handleError("All fields required");
    }

    try {
      if (editId) {
        // UPDATE
        const { data } = await API.patch(`/tasks/${editId}`, formData);
        handleSuccess(data.message);

        setTasks((prev) =>
          prev.map((t) => (t._id === editId ? data.data : t))
        );

        setEditId(null);
      } else {
        // ADD
        const { data } = await API.post("/tasks", formData);

        handleSuccess(data.message);

        setTasks((prev) => [...prev, data.data]);
      }

      // Reset form
      reset({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",
      });
    } catch (err) {
      handleError(
        err.response?.data?.message || "Something went wrong"
      );
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
    });
  };

  // Logout
  const handleLogout = () => {
    logout();
    handleSuccess("Logged out");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer autoClose={2000} />
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>{editId ? "Edit Task" : "Add Task"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("title", { required: true })}
          placeholder="Title"
        />
        <br /><br />

        <input
          {...register("description", { required: true })}
          placeholder="Description"
        />
        <br /><br />

        <select {...register("priority")}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br /><br />

        <input
          type="date"
          {...register("dueDate", { required: true })}
        />
        <br /><br />

        <button type="submit">
          {editId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <hr />

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.completed ? "Done" : "Pending"}</p>

            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;