import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const { getThemeColors } = useTheme();
    const navigate = useNavigate();
    const colors = getThemeColors();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Failed to register'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.background }}>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: colors.text }}>
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/login"
                            className="font-medium hover:underline"
                            style={{ color: colors.primary }}
                        >
                            sign in to your account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                        />

                        <Input
                            label="Email Address"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />
                    </div>

                    {errors.submit && (
                        <div className="text-red-500 text-sm text-center">
                            {errors.submit}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={isLoading}
                        className="w-full"
                    >
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Register; 