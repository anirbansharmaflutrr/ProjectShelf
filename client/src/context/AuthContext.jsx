import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const { data } = await api.get('/api/users/profile');
            setUser(data);
            setError(null);
        } catch (error) {
            console.error('Error loading user profile:', error);
            
            // Don't remove token on network errors or other non-auth errors
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setError('Session expired. Please login again.');
            } else {
                setError(error.response?.data?.message || 'Error loading user profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await api.post('/api/auth/register', {
                username,
                email,
                password
            });
            localStorage.setItem('token', data.token);
            setUser(data);
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/api/users/profile', profileData);
            setUser(data);
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Profile update failed');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 