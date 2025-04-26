import { useTheme } from '../../context/ThemeContext';

const Input = ({
    label,
    type = 'text',
    error,
    className = '',
    ...props
}) => {
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={props.id || props.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ color: colors.text }}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    className={`
                        block w-full rounded-md border-0 py-1.5 px-3
                        shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400
                        focus:ring-2 focus:ring-inset
                        sm:text-sm sm:leading-6
                        ${error ? 'ring-red-500' : 'focus:ring-blue-500'}
                        ${className}
                    `}
                    style={{
                        '--tw-ring-color': error ? '#EF4444' : colors.primary,
                        backgroundColor: colors.background,
                        color: colors.text
                    }}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Input; 