import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // This component handles the redirect from Google OAuth
        // The token will be automatically processed by AuthContext
        // We just need to redirect to the dashboard
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate, user]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <svg 
                        className="w-16 h-16 text-green-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Authentication Successful!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You've successfully logged in. Redirecting to your dashboard...
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-green-600 h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;
