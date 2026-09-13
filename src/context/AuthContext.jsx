import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
    }

    return null;
  });

  const login = (userData, token) => {

    console.log("========== AUTH LOGIN ==========");
    console.log("User:", userData);
    console.log("Role:", userData?.role);
    console.log("Token received:", !!token);

    if (!token) {
      console.error("❌ LOGIN ERROR: No token received");
      return;
    }

    // Save user
    localStorage.setItem('user', JSON.stringify(userData));

    // Save JWT token
    localStorage.setItem('token', token);

    // Update React state
    setUser(userData);

    console.log(
      "Token exists after saving:",
      !!localStorage.getItem('token')
    );

    console.log("================================");
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('secure_med_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}