import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("token") ? true : false,
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuth(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
