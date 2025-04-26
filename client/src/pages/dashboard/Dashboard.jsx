import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import { 
    LayoutDashboard, 
    TrendingUp, 
    Eye, 
    Heart, 
    Activity, 
    PlusCircle, 
    ArrowRight, 
    Settings, 
    BarChart3, 
    Zap,
    Sparkles
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const { getThemeColors } = useTheme();
    const { projects, loading, error, fetchProjects } = useProjects();
    const colors = getThemeColors();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetchProjects();
        
        // Set greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, [fetchProjects]);

    const getTotalViews = () => {
        return projects.reduce((total, project) => total + (project.analytics?.views || 0), 0);
    };

    const getTotalEngagements = () => {
        return projects.reduce((total, project) => total + (project.analytics?.engagement || 0), 0);
    };

    const getEngagementRate = () => {
        const views = getTotalViews();
        if (views === 0) return 0;
        return Math.round((getTotalEngagements() / views) * 100);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderColor: colors.primary }}></div>
                <p className="text-xl font-medium animate-pulse" style={{ color: colors.text }}>
                    Loading your creative space...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 max-w-md mx-auto">
                <div className="bg-red-50 rounded-lg shadow-lg p-8 border border-red-100">
                    <p className="text-red-600 mb-6 text-lg">{error}</p>
                    <Button onClick={fetchProjects} className="px-6 py-2.5">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg" 
                style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                }}>
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <radialGradient id="radial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <polygon fill="url(#radial)" points="0,0 100,0 100,100 0,100" />
                    </svg>
                </div>
                
                <div className="relative px-8 py-12 md:py-16 md:px-12">
                    <div className="max-w-3xl">
                        <span className="inline-block bg-white bg-opacity-25 rounded-full px-4 py-1.5 text-sm font-medium text-white mb-4">
                            {greeting}, {user.name || user.username}! 👋
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Welcome to Your Creative Dashboard
                        </h1>
                        <p className="text-white text-opacity-90 text-lg mb-8 max-w-2xl">
                            Track your portfolio progress, manage your projects, and showcase your creative work to the world.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/projects/create">
                                <Button className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg px-6 py-3 flex items-center">
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Create New Project
                                </Button>
                            </Link>
                            <Link to={`/${user.username}`} target="_blank">
                                <Button variant="secondary" className="bg-white text-white px-6 py-3 flex items-center">
                                    <Eye className="h-5 w-5 mr-2" />
                                    View Public Portfolio
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 transform transition-all hover:scale-105 hover:shadow-lg" 
                    style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">TOTAL PROJECTS</p>
                            <h3 className="text-3xl font-bold" style={{ color: colors.primary }}>
                                {projects.length}
                            </h3>
                        </div>
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
                            <LayoutDashboard style={{ color: colors.primary }} className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Link to="/projects" className="flex items-center font-medium hover:underline" style={{ color: colors.primary }}>
                            View all projects
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 transform transition-all hover:scale-105 hover:shadow-lg" 
                    style={{ backgroundColor: colors.background, borderColor: colors.secondary }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">TOTAL VIEWS</p>
                            <h3 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                                {getTotalViews()}
                            </h3>
                        </div>
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                            <Eye style={{ color: colors.secondary }} className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-500">
                            Across all projects
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 transform transition-all hover:scale-105 hover:shadow-lg" 
                    style={{ backgroundColor: colors.background, borderColor: colors.accent }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">ENGAGEMENTS</p>
                            <h3 className="text-3xl font-bold" style={{ color: colors.accent }}>
                                {getTotalEngagements()}
                            </h3>
                        </div>
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.accent}15` }}>
                            <Heart style={{ color: colors.accent }} className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-500">
                            Interactions with your work
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 transform transition-all hover:scale-105 hover:shadow-lg" 
                    style={{ backgroundColor: colors.background, borderColor: "#10B981" }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">ENGAGEMENT RATE</p>
                            <h3 className="text-3xl font-bold text-emerald-500">
                                {getEngagementRate()}%
                            </h3>
                        </div>
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-emerald-100">
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-gray-500">
                            Conversion from views
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Projects Section */}
            <div className="relative bg-white rounded-xl shadow-md p-8 border-l-4" 
                style={{ backgroundColor: colors.background, borderLeftColor: colors.primary }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center" style={{ color: colors.text }}>
                            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                            Recent Projects
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Your latest creative work
                        </p>
                    </div>
                    <Link to="/projects/create">
                        <Button className="px-5 py-2.5 shadow-md flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl" style={{ borderColor: `${colors.primary}30` }}>
                        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                            No projects yet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Start building your portfolio by creating your first project. Showcase your best work to potential clients and peers.
                        </p>
                        <Link to="/projects/create">
                            <Button className="px-6 py-2.5 shadow-lg">
                                Create First Project
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.slice(0, 3).map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>

                        {projects.length > 3 && (
                            <div className="text-center mt-8">
                                <Link to="/projects">
                                    <Button variant="secondary" className="px-6 py-2.5">
                                        View All Projects ({projects.length})
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    to="/profile"
                    className="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all flex items-start border-l-4 border-gray-200 hover:border-blue-400"
                    style={{ backgroundColor: colors.background }}
                >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                        <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: colors.text }}>
                            Profile & Settings
                        </h3>
                        <p className="text-gray-500">
                            Customize your profile, update personal information, and adjust theme preferences
                        </p>
                    </div>
                </Link>
                
                <Link
                    to="/analytics"
                    className="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all flex items-start border-l-4 border-gray-200 hover:border-purple-400"
                    style={{ backgroundColor: colors.background }}
                >
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors" style={{ color: colors.text }}>
                            Analytics & Insights
                        </h3>
                        <p className="text-gray-500">
                            Get detailed performance metrics, track engagement, and analyze your portfolio's impact
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard; 