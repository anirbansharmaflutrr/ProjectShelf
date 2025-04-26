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

        // Check if redirected from Google OAuth with token
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('token');
        
        if (oauthToken) {
            localStorage.setItem('token', oauthToken);
            // Clean the URL by removing token param
            window.history.replaceState({}, document.title, window.location.pathname);
            loadUser();
        }
    }, []);

    const loadUser = async () => {
        try {
            const { data } = await api.get('/api/users/profile');
            setUser(data);
            setError(null);
            
            // Record page view for analytics
            recordPageView();
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

    // Function to initiate Google OAuth login
    const googleLogin = async () => {
        try {
            // First check if Google OAuth is configured on the server
            const response = await api.get('/api/auth/google');
            
            // If we get here, it means the server returned an error rather than redirecting
            // This happens when Google OAuth is not configured
            if (response && response.data && response.data.message) {
                setError(response.data.message);
            }
        } catch (error) {
            // If status is 0, it means we're being redirected to Google, which is expected behavior
            if (error.request && error.request.status === 0) {
                // This is actually the success case - we're being redirected to Google
                window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`;
            } else if (error.response && error.response.status === 501) {
                // Google OAuth not configured
                setError(error.response.data.message || 'Google login is not available at this time');
            } else {
                setError('Failed to connect to Google authentication service');
            }
        }
    };

    // Record page view for analytics
    const recordPageView = async () => {
        try {
            await api.post('/api/analytics/page-view');
        } catch (error) {
            console.error('Error recording page view:', error);
        }
    };

    // Record project view for analytics
    const recordProjectView = async (projectId) => {
        try {
            await api.post(`/api/analytics/project-view/${projectId}`);
        } catch (error) {
            console.error('Error recording project view:', error);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        googleLogin,
        recordPageView,
        recordProjectView
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;