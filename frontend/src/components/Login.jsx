import React, { useContext } from "react";
import styles from "./ls.module.css";
import API from "../utils/axios";
import { handleError, handleSuccess } from "../utils/Toastify";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    const { username, password } = data;

    try {
      const { data } = await API.post("/users/login", {
        username,
        password,
      });

      localStorage.setItem("username", data.username);
      login(data.jwtToken);

      handleSuccess("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;

      if (msg) {
        if (msg.toLowerCase().includes("user does not exist")) {
          handleError("User does not exist. Redirecting to signup...");
          setTimeout(() => {
            navigate("/signup");
          }, 3000);
        } else {
          handleError(msg);
        }
      } else {
        handleError("Server error, please try again");
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <div className={styles.box}>
        <h2 className={styles.heading}>Login</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputBox}>
            <label>Username</label>
            <input
              className={styles.inputField}
              {...register("username")}
              type="text"
            />
          </div>

          <div className={styles.inputBox}>
            <label>Password</label>
            <input
              className={styles.inputField}
              {...register("password")}
              type="password"
            />
          </div>

          <input type="submit" className={styles.btn} value="Login" />
        </form>

        <p className={styles.text}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;