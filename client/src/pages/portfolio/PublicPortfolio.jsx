import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import Button from '../../components/ui/Button';

const PublicPortfolio = () => {
    const { username } = useParams();
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    const [portfolio, setPortfolio] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Fetch user portfolio by username
                const response = await api.get(`/api/users/portfolio/${username}`);
                setPortfolio(response.data.user);
                setProjects(response.data.projects || []);
            } catch (error) {
                setError('Failed to load portfolio. This user may not exist or has not set up their portfolio yet.');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Portfolio Not Found</h2>
                <p className="text-gray-600 mb-6" style={{ color: colors.text }}>{error}</p>
                <Button onClick={() => window.location.href = "/"}>
                    Return to Homepage
                </Button>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Portfolio Not Found</h2>
                <p className="text-gray-600 mb-6" style={{ color: colors.text }}>This user does not exist or has not set up their portfolio yet.</p>
                <Button onClick={() => window.location.href = "/"}>
                    Return to Homepage
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
            {/* Hero Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center">
                    {portfolio.profileImage && (
                        <img 
                            src={portfolio.profileImage} 
                            alt={portfolio.name} 
                            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                        />
                    )}
                    <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                        {portfolio.name}
                    </h1>
                    {portfolio.title && (
                        <p className="text-xl mb-6">
                            {portfolio.title}
                        </p>
                    )}
                    {portfolio.bio && (
                        <p className="max-w-2xl mx-auto mb-8 text-lg">
                            {portfolio.bio}
                        </p>
                    )}
                    
                    {/* Social Links */}
                    {portfolio.social && (
                        <div className="flex justify-center space-x-4 mb-8">
                            {portfolio.social.twitter && (
                                <a href={portfolio.social.twitter} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-400 hover:text-blue-500">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            )}
                            {portfolio.social.linkedin && (
                                <a href={portfolio.social.linkedin} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-700 hover:text-blue-800">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                                    </svg>
                                </a>
                            )}
                            {portfolio.social.github && (
                                <a href={portfolio.social.github} target="_blank" rel="noopener noreferrer" 
                                   className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {portfolio.social.website && (
                                <a href={portfolio.social.website} target="_blank" rel="noopener noreferrer" 
                                   className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Section */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>Projects</h2>
                
                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm" style={{ backgroundColor: colors.accent + '20' }}>
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-gray-600">This user hasn't added any projects to their portfolio yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => (
                            <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: colors.accent + '10' }}>
                                {project.mediaGallery && project.mediaGallery[0] && (
                                    <div className="h-48 overflow-hidden">
                                        {project.mediaGallery[0].type === 'image' ? (
                                            <img 
                                                src={project.mediaGallery[0].url} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <iframe
                                                src={project.mediaGallery[0].url}
                                                title={project.title}
                                                className="w-full h-full"
                                                allowFullScreen
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>{project.title}</h3>
                                    <p className="text-gray-600 mb-4" style={{ color: colors.text }}>
                                        {project.overview.length > 150 
                                            ? `${project.overview.substring(0, 150)}...` 
                                            : project.overview}
                                    </p>
                                    
                                    {project.tools && project.tools.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {project.tools.map((tool, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 rounded-full text-xs"
                                                        style={{ backgroundColor: colors.primary, color: '#fff' }}
                                                    >
                                                        {tool.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <button 
                                        className="text-sm font-medium py-2 px-4 rounded-md" 
                                        style={{ backgroundColor: colors.primary, color: '#fff' }}
                                        onClick={() => window.location.href = `/projects/${project._id}/public`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Section */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8" style={{ color: colors.primary }}>Get In Touch</h2>
                {portfolio.email && (
                    <div className="mb-8">
                        <p className="text-lg mb-2">Email me at:</p>
                        <a 
                            href={`mailto:${portfolio.email}`} 
                            className="text-xl font-semibold hover:underline"
                            style={{ color: colors.primary }}
                        >
                            {portfolio.email}
                        </a>
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-md p-8" style={{ backgroundColor: colors.accent + '10' }}>
                    <form className="space-y-4">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full px-4 py-2 rounded-md border border-gray-300"
                                style={{ backgroundColor: colors.background, color: colors.text }}
                            />
                        </div>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="w-full px-4 py-2 rounded-md border border-gray-300"
                                style={{ backgroundColor: colors.background, color: colors.text }}
                            />
                        </div>
                        <div>
                            <textarea 
                                placeholder="Your Message" 
                                rows="4" 
                                className="w-full px-4 py-2 rounded-md border border-gray-300"
                                style={{ backgroundColor: colors.background, color: colors.text }}
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="px-6 py-2 rounded-md font-medium"
                            style={{ backgroundColor: colors.primary, color: '#fff' }}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 px-4 text-center" style={{ backgroundColor: colors.accent + '20' }}>
                <p>© {new Date().getFullYear()} {portfolio.name}'s Portfolio. Made with ProjectShelf.</p>
            </footer>
        </div>
    );
};

export default PublicPortfolio; 