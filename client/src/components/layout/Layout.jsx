import { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import DebugAuth from '../ui/DebugAuth';
import { 
    LayoutDashboard, 
    FolderKanban, 
    BarChart, 
    User, 
    LogOut, 
    Menu as MenuIcon, 
    X, 
    ChevronDown, 
    Plus,
    Settings,
    Laptop
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Analytics', href: '/analytics', icon: BarChart }
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { getThemeColors } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const colors = getThemeColors();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="min-h-screen bg-gray-100" style={{ backgroundColor: colors.background }}>
            <Disclosure as="nav" className="bg-white shadow" style={{ backgroundColor: colors.primary }}>
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex flex-shrink-0 items-center">
                                        <Link to="/" className="text-xl font-bold text-white flex items-center">
                                            <Laptop className="h-6 w-6 mr-2" />
                                            ProjectShelf
                                        </Link>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={`inline-flex items-center px-3 pt-1 text-sm font-medium transition-colors ${
                                                    isActive(item.href) 
                                                        ? 'border-b-2 border-white text-white' 
                                                        : 'text-white/80 hover:text-white'
                                                }`}
                                            >
                                                <item.icon className="h-4 w-4 mr-2" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                                    <Link 
                                        to="/projects/create"
                                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-all"
                                    >
                                        <Plus className="h-4 w-4 mr-1.5" />
                                        New Project
                                    </Link>
                                    
                                    {user ? (
                                        <Menu as="div" className="relative ml-3">
                                            <Menu.Button className="flex items-center rounded-full bg-white p-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={user.profilePicture || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                />
                                                <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                to="/profile"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700 flex items-center'
                                                                )}
                                                            >
                                                                <User className="h-4 w-4 mr-2" />
                                                                Your Profile
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                to="/profile"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700 flex items-center'
                                                                )}
                                                            >
                                                                <Settings className="h-4 w-4 mr-2" />
                                                                Settings
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center'
                                                                )}
                                                            >
                                                                <LogOut className="h-4 w-4 mr-2" />
                                                                Sign out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="text-white hover:text-gray-200"
                                        >
                                            Sign in
                                        </Link>
                                    )}
                                </div>
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <X className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block py-2 pl-3 pr-4 flex items-center ${
                                            isActive(item.href)
                                                ? 'bg-white/10 border-l-4 border-white text-white'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        {item.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/projects/create"
                                    className="flex items-center py-2 pl-3 pr-4 text-white/80 hover:bg-white/10 hover:text-white"
                                >
                                    <Plus className="h-5 w-5 mr-3" />
                                    New Project
                                </Link>
                            </div>
                            {user && (
                                <div className="border-t border-white/20 pb-3 pt-4">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={user.profilePicture || 'https://via.placeholder.com/40'}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-white">{user.username}</div>
                                            <div className="text-sm font-medium text-gray-200">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-white hover:bg-white/10 flex items-center"
                                        >
                                            <User className="h-5 w-5 mr-3" />
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-white hover:bg-white/10 flex items-center"
                                        >
                                            <Settings className="h-5 w-5 mr-3" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 flex items-center"
                                        >
                                            <LogOut className="h-5 w-5 mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Debug Auth component (only visible in development) */}
            {process.env.NODE_ENV !== 'production' && <DebugAuth />}
        </div>
    );
};

export default Layout; 