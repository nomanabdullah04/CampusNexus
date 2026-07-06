import React, { createContext, useContext, useEffect, useState } from 'react';
import { privateAPI } from '../api/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) { setUser(null); setLoading(false); return; }
      const response = await privateAPI.get('/user/me');
      if (response.data.success) setUser(response.data.data);
      else { setError('Failed to fetch user profile'); setUser(null); }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
      setUser(null);
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => setUser(userData);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  useEffect(() => { fetchUser(); }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser, updateUser, clearUser, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
