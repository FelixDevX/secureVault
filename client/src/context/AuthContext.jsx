import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile if JWT exists in local storage
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/profile');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome, ${res.data.user.name}! Account created.`);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Try a different email.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout API warning:', err.message);
    }
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Refreshes profile user data from server (used after profile edits)
  const refreshUser = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err.message);
    }
  };

  // Google login handler
  const googleLogin = async (credential) => {
    try {
      const res = await api.post('/auth/google', { credential });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome, ${res.data.user.name}!`);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Google authentication failed.';
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
