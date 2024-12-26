// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the Context
export const UserContext = createContext(null);

// Create the Provider
export const UserProvider = ({ children }) => {
  // 1) Initialize the user from localStorage (if present)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('climbhubUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2) Whenever "user" changes, save it to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('climbhubUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('climbhubUser');
    }
  }, [user]);

  // Optional helpers if you want to encapsulate logic
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    // localStorage.removeItem('climbhubUser'); // This is also handled by useEffect when user=null
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
