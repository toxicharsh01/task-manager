import React, { useEffect } from "react";
import styles from "./ls.module.css";
import API from "../utils/axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils/Toastify";

function Signup() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/dashboard"); 
    }
  }, []);

  // handle signup form submission
  const onSubmit = async (data) => {
    const { username, email, password } = data;

    try {
      const { data } = await API.post("/users/signup", { username, email, password });

      if (data?.message) handleSuccess(data.message);

      // redirect to login after success
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      const msg = error.response?.data?.message;
      handleError(msg || "Server error, please try again");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <div className={styles.box}>
        <h2 className={styles.heading}>Sign Up</h2>

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
            <label>Email</label>
            <input
              className={styles.inputField}
              {...register("email")}
              type="email"
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

          <input type="submit" className={styles.btn} value="Sign Up" />
        </form>

        <p className={styles.text}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;