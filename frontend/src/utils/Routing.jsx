import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import ProtectedRoutes from "../context/ProtectedRoutes";

function Routing() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default Routing;
