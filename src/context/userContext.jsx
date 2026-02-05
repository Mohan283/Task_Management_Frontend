import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  axios
    .get("http://localhost:8000/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUser(res.data);
    })
    .catch(() => {
      localStorage.removeItem("token");
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  const updateUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
