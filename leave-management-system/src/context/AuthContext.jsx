import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("[AuthContext] Loaded user from localStorage:", parsed);
      setUser(parsed);
    } else {
      console.log("[AuthContext] No user in localStorage");
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("auth_user", JSON.stringify(data));
    setUser(data);
    console.log("[AuthContext] User logged in:", data);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
    console.log("[AuthContext] User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
