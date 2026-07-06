import React, { createContext, useContext, useEffect, useState } from 'react';
import { privateAPI } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('accessToken');
      // console.log(token)

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await privateAPI.get('/user/me');
      // console.log(response)
        // console.log(response)
        // console.log(response.data)


      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setError('Failed to fetch user profile');
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
      setUser(null);


      if (err.response?.status === 401) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update user profile locally
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Clear user data (logout)
  const clearUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
    clearUser,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;