import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import ProtectedRoutes from "../context/ProtectedRoutes";
import PageNotFound from "./PageNotFound";

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
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routing;
