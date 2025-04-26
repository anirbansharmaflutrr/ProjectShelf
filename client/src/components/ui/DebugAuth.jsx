import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DebugAuth = () => {
  const { user, error } = useAuth();
  const [token, setToken] = useState(localStorage.getItem('token') || 'No token');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update token state when localStorage changes
    const updateToken = () => {
      setToken(localStorage.getItem('token') || 'No token');
    };

    // Check for token changes every second
    const intervalId = setInterval(updateToken, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-xs opacity-50 hover:opacity-100"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md text-xs max-w-xs z-50">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Auth Debug</h3>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="font-semibold">User:</div>
          <div className="overflow-x-auto whitespace-nowrap">
            {user ? JSON.stringify(user) : 'Not logged in'}
          </div>
        </div>
        
        <div>
          <div className="font-semibold">Token:</div>
          <div className="overflow-x-auto whitespace-nowrap">
            {token && token !== 'No token' 
              ? `${token.substring(0, 15)}...` 
              : token}
          </div>
        </div>
        
        {error && (
          <div>
            <div className="font-semibold text-red-400">Error:</div>
            <div className="text-red-400">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAuth; 