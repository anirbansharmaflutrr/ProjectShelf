import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

const defaultThemes = {
    default: {
        name: 'Default',
        colors: {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#60A5FA',
            background: '#FFFFFF',
            text: '#1F2937'
        }
    },
    dark: {
        name: 'Dark Creative',
        colors: {
            primary: '#6D28D9',
            secondary: '#4C1D95',
            accent: '#7C3AED',
            background: '#111827',
            text: '#F9FAFB'
        }
    },
    vibrant: {
        name: 'Vibrant',
        colors: {
            primary: '#EC4899',
            secondary: '#BE185D',
            accent: '#F472B6',
            background: '#FFFFFF',
            text: '#1F2937'
        }
    },
    forest: {
        name: 'Forest',
        colors: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#10B981',
            background: '#F8FAF9',
            text: '#1F2937'
        }
    },
    ocean: {
        name: 'Ocean',
        colors: {
            primary: '#0EA5E9',
            secondary: '#0284C7',
            accent: '#38BDF8',
            background: '#F0F9FF',
            text: '#0F172A'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [currentTheme, setCurrentTheme] = useState('default');
    const [customColors, setCustomColors] = useState(null);

    // Load theme from local storage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem('userTheme');
        const savedColors = localStorage.getItem('userCustomColors');
        
        if (savedTheme) {
            setCurrentTheme(savedTheme);
        } else if (user?.selectedTheme) {
            setCurrentTheme(user.selectedTheme);
        }
        
        if (savedColors) {
            try {
                setCustomColors(JSON.parse(savedColors));
            } catch (e) {
                console.error('Failed to parse saved colors:', e);
                setCustomColors(null);
            }
        } else if (user?.themeCustomization) {
            setCustomColors(user.themeCustomization);
        }
    }, [user]);

    const updateTheme = async (themeName, colors = null) => {
        try {
            // Save theme choices to local storage
            localStorage.setItem('userTheme', themeName);
            
            if (colors) {
                localStorage.setItem('userCustomColors', JSON.stringify(colors));
            } else {
                localStorage.removeItem('userCustomColors');
            }
            
            // Update state
            setCurrentTheme(themeName);
            setCustomColors(colors);
            
            // Try to update on server if available, but don't throw error if it fails
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Don't attempt API call without token
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                
                const themeData = {
                    selectedTheme: themeName,
                    themeCustomization: colors
                };
                
                // Make API call but don't await it
                axios.put('/api/users/theme', themeData, config)
                    .catch(err => console.log('Theme saved locally, server update failed.'));
            } catch (serverError) {
                // Silently fail server updates - local storage is our primary storage
                console.log('Using local theme storage only.');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to update theme:', error);
            throw error;
        }
    };

    const getThemeColors = () => {
        if (customColors) {
            return {
                ...defaultThemes[currentTheme]?.colors || defaultThemes.default.colors,
                ...customColors
            };
        }
        return defaultThemes[currentTheme]?.colors || defaultThemes.default.colors;
    };

    const value = {
        themes: defaultThemes,
        currentTheme,
        customColors,
        updateTheme,
        getThemeColors
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;