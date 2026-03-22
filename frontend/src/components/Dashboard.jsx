import React, { useContext, useEffect, useState } from "react";
import "./ls.module.css";
import { AuthContext } from "../context/AuthContext";


function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUsername(username);
  }, []);

  const { logout } = useContext(AuthContext);
  return (
   <div className={ls.container}>
  <div className={ls.box}>
    <h2 className="heading">Welcome to task-manager {username}</h2>

    <div className="text" style={{ marginTop: "20px" }}>
      <button className="btn" onClick={logout}>
        Logout
      </button>
    </div>
  </div>
</div>
  );
}

export default Dashboard;
