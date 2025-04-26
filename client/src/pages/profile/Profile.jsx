import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { uploadMedia } from '../../utils/cloudinary';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AlertTriangle, CheckCircle, Palette, Settings } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { themes, currentTheme, updateTheme, getThemeColors, customColors: userCustomColors } = useTheme();
    const colors = getThemeColors();

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        website: user?.socialLinks?.website || '',
        github: user?.socialLinks?.github || '',
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || ''
    });

    const [customColors, setCustomColors] = useState({
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [themePreview, setThemePreview] = useState(null);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    // Update custom colors when theme context changes
    useEffect(() => {
        if (userCustomColors) {
            setCustomColors({
                primary: userCustomColors.primary || colors.primary,
                secondary: userCustomColors.secondary || colors.secondary,
                accent: userCustomColors.accent || colors.accent
            });
        } else {
            setCustomColors({
                primary: colors.primary,
                secondary: colors.secondary,
                accent: colors.accent
            });
        }
    }, [userCustomColors, colors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await uploadMedia(file);
            await updateProfile({ profilePicture: result.url });
            setSuccessMessage('Profile picture updated successfully');
        } catch (error) {
            setError('Failed to upload profile picture');
        } finally {
            setIsLoading(false);
        }
    };

    const handleThemeChange = async (themeName) => {
        setError(null);
        setIsLoading(true);
        setThemePreview(themeName);
        
        try {
            const success = await updateTheme(themeName);
            setSuccessMessage('Theme updated successfully');
            
            // Reset custom colors to match the new theme
            const newColors = themes[themeName].colors;
            setCustomColors({
                primary: newColors.primary,
                secondary: newColors.secondary,
                accent: newColors.accent
            });
        } catch (error) {
            console.error('Theme update error:', error);
            setError('Theme saved locally, but server update failed');
            // Still show success since localStorage update worked
            setSuccessMessage('Theme saved to your browser');
        } finally {
            setIsLoading(false);
        }
    };

    const handleColorChange = (colorType, value) => {
        setCustomColors(prev => ({
            ...prev,
            [colorType]: value
        }));
    };

    const handleCustomThemeApply = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await updateTheme(currentTheme, customColors);
            setSuccessMessage('Custom colors applied successfully');
        } catch (error) {
            console.error('Custom color update error:', error);
            setError('Colors saved locally, but server update failed');
            // Still show success since localStorage update worked
            setSuccessMessage('Colors saved to your browser');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const profileData = {
                username: formData.username,
                email: formData.email,
                bio: formData.bio,
                socialLinks: {
                    website: formData.website,
                    github: formData.github,
                    linkedin: formData.linkedin,
                    twitter: formData.twitter
                }
            };

            await updateProfile(profileData);
            setSuccessMessage('Profile updated successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const renderProfileSettings = () => (
        <>
            {/* Profile Picture */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <img
                        src={user?.profilePicture || 'https://via.placeholder.com/100'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2"
                        style={{ borderColor: colors.primary }}
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-picture"
                        />
                        <label htmlFor="profile-picture">
                            <Button
                                as="span"
                                variant="secondary"
                                loading={isLoading}
                            >
                                Change Picture
                            </Button>
                        </label>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <div>
                    <label
                        htmlFor="bio"
                        className="block text-sm font-medium mb-1"
                        style={{ color: colors.text }}
                    >
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                        style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                            '--tw-ring-color': colors.primary
                        }}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                        Social Links
                    </h3>
                    <Input
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                    <Input
                        label="GitHub"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                    />
                    <Input
                        label="LinkedIn"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                    />
                    <Input
                        label="Twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                    />
                </div>

                <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full"
                >
                    Save Changes
                </Button>
            </form>
        </>
    );

    const renderThemeSettings = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Select Theme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(themes).map(([key, theme]) => (
                        <button
                            key={key}
                            onClick={() => handleThemeChange(key)}
                            className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                                (themePreview || currentTheme) === key ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                                backgroundColor: theme.colors.background,
                                borderColor: (themePreview || currentTheme) === key ? theme.colors.primary : 'transparent',
                                ringColor: theme.colors.primary
                            }}
                        >
                            <div className="text-center">
                                <h4 className="font-medium mb-3" style={{ color: theme.colors.text }}>
                                    {theme.name}
                                </h4>
                                <div className="flex justify-center space-x-3 mb-4">
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                                </div>
                                <div 
                                    className="py-2 px-3 rounded-md text-sm text-white mt-2" 
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    {(themePreview || currentTheme) === key ? 'Selected' : 'Select Theme'}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Customize Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium" style={{ color: colors.text }}>
                            Primary Color
                        </label>
                        <div className="flex items-center">
                            <input
                                type="color"
                                value={customColors.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                className="w-12 h-12 rounded-md cursor-pointer mr-3"
                            />
                            <input 
                                type="text"
                                value={customColors.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.primary
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="block text-sm font-medium" style={{ color: colors.text }}>
                            Secondary Color
                        </label>
                        <div className="flex items-center">
                            <input
                                type="color"
                                value={customColors.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                                className="w-12 h-12 rounded-md cursor-pointer mr-3"
                            />
                            <input 
                                type="text"
                                value={customColors.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.secondary
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="block text-sm font-medium" style={{ color: colors.text }}>
                            Accent Color
                        </label>
                        <div className="flex items-center">
                            <input
                                type="color"
                                value={customColors.accent}
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                className="w-12 h-12 rounded-md cursor-pointer mr-3"
                            />
                            <input 
                                type="text"
                                value={customColors.accent}
                                onChange={(e) => handleColorChange('accent', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.accent
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Color Preview */}
                <div className="border rounded-lg p-6 mb-6" style={{ borderColor: `${colors.primary}30` }}>
                    <h4 className="font-medium mb-4" style={{ color: colors.text }}>Preview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-md shadow-sm flex items-center justify-center text-white"
                            style={{ backgroundColor: customColors.primary }}>
                            Primary
                        </div>
                        <div className="p-4 rounded-md shadow-sm flex items-center justify-center text-white"
                            style={{ backgroundColor: customColors.secondary }}>
                            Secondary
                        </div>
                        <div className="p-4 rounded-md shadow-sm flex items-center justify-center text-white"
                            style={{ backgroundColor: customColors.accent }}>
                            Accent
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-md" style={{ backgroundColor: customColors.primary + '20', color: colors.text }}>
                        <p>This is how your primary color will look as a background shade.</p>
                    </div>
                </div>

                <Button
                    onClick={handleCustomThemeApply}
                    loading={isLoading}
                    className="w-full py-2.5"
                >
                    Apply Custom Colors
                </Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Section Tabs */}
            <div className="flex border-b space-x-2">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-3 px-5 font-medium flex items-center ${activeTab === 'profile' ? 'border-b-2 -mb-px' : 'text-gray-500'}`}
                    style={{ borderColor: activeTab === 'profile' ? colors.primary : 'transparent' }}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Information
                </button>
                <button
                    onClick={() => setActiveTab('theme')}
                    className={`py-3 px-5 font-medium flex items-center ${activeTab === 'theme' ? 'border-b-2 -mb-px' : 'text-gray-500'}`}
                    style={{ borderColor: activeTab === 'theme' ? colors.primary : 'transparent' }}
                >
                    <Palette className="h-4 w-4 mr-2" />
                    Theme Settings
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">
                        {successMessage}
                    </p>
                </div>
            )}

            {/* Active Section */}
            <div className="bg-white rounded-xl shadow-md p-8" style={{ backgroundColor: colors.background }}>
                <h2 className="text-2xl font-bold mb-8 pb-4 border-b" style={{ color: colors.text, borderColor: `${colors.primary}30` }}>
                    {activeTab === 'profile' ? 'Profile Settings' : 'Theme Customization'}
                </h2>

                {activeTab === 'profile' ? renderProfileSettings() : renderThemeSettings()}
            </div>
        </div>
    );
};

export default Profile; 