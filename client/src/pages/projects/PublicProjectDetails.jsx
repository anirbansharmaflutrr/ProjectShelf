import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import Button from '../../components/ui/Button';

const PublicProjectDetails = () => {
    const { id } = useParams();
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/api/projects/${id}/public`);
                setProject(response.data.project);
                setCreator(response.data.creator);
                
                // Increment view count
                try {
                    await api.post(`/api/projects/${id}/analytics/view`);
                } catch (error) {
                    console.error("Failed to record view:", error);
                }
            } catch (error) {
                setError('Failed to load project. It may not exist or is not public.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleEngagement = async () => {
        try {
            await api.post(`/api/projects/${id}/analytics/engage`);
        } catch (error) {
            console.error("Failed to record engagement:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Project Not Found</h2>
                <p className="text-gray-600 mb-6" style={{ color: colors.text }}>
                    {error || "This project does not exist or is not public."}
                </p>
                <Button onClick={() => window.history.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
            <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Project Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                                {project.title}
                            </h1>
                            <div className="flex items-center text-sm mb-4">
                                <span className="mr-4" style={{ color: colors.text }}>
                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                <span className="mr-4" style={{ color: colors.text }}>
                                    Views: {project.analytics?.views || 0}
                                </span>
                                <span style={{ color: colors.text }}>
                                    Engagements: {project.analytics?.engagement || 0}
                                </span>
                            </div>
                            {creator && (
                                <div className="flex items-center mb-2">
                                    <span className="text-sm" style={{ color: colors.text }}>
                                        By{" "}
                                        <Link 
                                            to={`/${creator.username}`} 
                                            className="font-medium hover:underline"
                                            style={{ color: colors.primary }}
                                            onClick={handleEngagement}
                                        >
                                            {creator.name}
                                        </Link>
                                    </span>
                                </div>
                            )}
                        </div>
                        {creator && (
                            <Link 
                                to={`/${creator.username}`}
                                className="px-4 py-2 text-sm font-medium rounded-md"
                                style={{ backgroundColor: colors.primary, color: '#fff' }}
                                onClick={handleEngagement}
                            >
                                View Portfolio
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Media Gallery */}
                {project.mediaGallery && project.mediaGallery.length > 0 && (
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {project.mediaGallery.map((media, index) => (
                                <div key={index} className="relative" onClick={handleEngagement}>
                                    {media.type === 'image' ? (
                                        <img 
                                            src={media.url} 
                                            alt={media.caption || `Project media ${index + 1}`} 
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <iframe 
                                            src={media.url} 
                                            title={media.caption || `Project video ${index + 1}`} 
                                            className="w-full h-64 rounded-lg"
                                            allowFullScreen
                                        />
                                    )}
                                    {media.caption && (
                                        <p className="mt-2 text-sm text-center" style={{ color: colors.text }}>
                                            {media.caption}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Overview */}
                <div className="mb-12 bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background, borderColor: colors.accent + '30', borderWidth: '1px' }}>
                    <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Overview</h2>
                    <p className="whitespace-pre-wrap" style={{ color: colors.text }}>{project.overview}</p>
                </div>
                
                {/* Tools Used */}
                {project.tools && project.tools.length > 0 && (
                    <div className="mb-12 bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background, borderColor: colors.accent + '30', borderWidth: '1px' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Tools & Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.tools.map((tool, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-sm"
                                    style={{ backgroundColor: colors.accent, color: '#fff' }}
                                >
                                    {tool.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Timeline */}
                {project.timeline && project.timeline.length > 0 && (
                    <div className="mb-12 bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background, borderColor: colors.accent + '30', borderWidth: '1px' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Project Timeline</h2>
                        <div className="space-y-4">
                            {project.timeline.map((event, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-24">
                                        <span className="text-sm" style={{ color: colors.text }}>
                                            {new Date(event.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium" style={{ color: colors.text }}>{event.title}</h3>
                                        <p className="text-sm" style={{ color: colors.text }}>{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Outcomes */}
                {project.outcomes && (
                    <div className="mb-12 bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background, borderColor: colors.accent + '30', borderWidth: '1px' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Project Outcomes</h2>
                        
                        {/* Metrics */}
                        {project.outcomes.metrics && project.outcomes.metrics.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Key Metrics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.outcomes.metrics.map((metric, index) => (
                                        <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: colors.accent + '20' }}>
                                            <p className="font-medium" style={{ color: colors.text }}>{metric.label}</p>
                                            <p className="text-2xl font-bold" style={{ color: colors.primary }}>{metric.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Testimonials */}
                        {project.outcomes.testimonials && project.outcomes.testimonials.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Testimonials</h3>
                                <div className="space-y-4">
                                    {project.outcomes.testimonials.map((testimonial, index) => (
                                        <blockquote
                                            key={index}
                                            className="p-4 rounded-lg"
                                            style={{ backgroundColor: colors.accent + '20' }}
                                        >
                                            <p className="mb-2 italic" style={{ color: colors.text }}>"{testimonial.content}"</p>
                                            <footer>
                                                <p className="font-medium" style={{ color: colors.text }}>{testimonial.author}</p>
                                                <p className="text-sm" style={{ color: colors.text }}>{testimonial.role}</p>
                                            </footer>
                                        </blockquote>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Contact Section */}
                {creator && (
                    <div className="mb-12 bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background, borderColor: colors.accent + '30', borderWidth: '1px' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Contact Creator</h2>
                        <div className="flex flex-col md:flex-row items-center md:space-x-4">
                            <p className="mb-4 md:mb-0" style={{ color: colors.text }}>
                                Interested in learning more about this project?
                            </p>
                            <Link 
                                to={`/${creator.username}`} 
                                className="px-4 py-2 text-sm font-medium rounded-md"
                                style={{ backgroundColor: colors.primary, color: '#fff' }}
                                onClick={handleEngagement}
                            >
                                Visit {creator.name}'s Portfolio
                            </Link>
                        </div>
                    </div>
                )}
                
                {/* Navigation */}
                <div className="flex justify-center">
                    <Button onClick={() => window.history.back()}>
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PublicProjectDetails; 