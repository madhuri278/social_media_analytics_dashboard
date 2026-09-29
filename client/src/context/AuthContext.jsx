import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('social_dashboard_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set default Authorization header for Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('social_dashboard_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('social_dashboard_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('social_dashboard_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
