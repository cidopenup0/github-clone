import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentuser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser({ id: userId });
    }
  }, []);

  const value = {
    currentuser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
