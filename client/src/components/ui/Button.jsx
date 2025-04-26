import { useTheme } from '../../context/ThemeContext';

const variants = {
    primary: 'text-white shadow hover:opacity-90 transition-transform hover:scale-105',
    secondary: 'bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-transform hover:scale-105',
    outline: 'bg-transparent border-2 hover:bg-gray-50 transition-transform hover:scale-105',
    danger: 'text-white shadow hover:opacity-90 transition-transform hover:scale-105 bg-red-600 hover:bg-red-700'
};

const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    as = 'button',
    ...props
}) => {
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    const baseStyle = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    const style = {};
    
    if (variant === 'primary') {
        style.backgroundColor = colors.primary;
    } else if (variant === 'secondary') {
        style.color = colors.primary;
    } else if (variant === 'outline') {
        style.borderColor = colors.primary;
        style.color = colors.primary;
    } else if (variant === 'danger') {
        // Use the danger colors from the variant class
    }

    // For "as" prop to render as different elements
    if (as !== 'button') {
        return (
            <div
                className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className} ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={disabled || loading ? undefined : onClick}
                style={style}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </div>
        );
    }

    return (
        <button
            type={type}
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={disabled || loading}
            onClick={onClick}
            style={style}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button; 