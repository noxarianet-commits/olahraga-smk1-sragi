/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data.data.user);
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [token]);

    const login = async (identifier, password) => {
        try {
            const response = await api.post('/auth/login', { identifier, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return { success: true, data: { user, token } };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
