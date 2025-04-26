import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Eye, Heart, ArrowRight, Calendar, Play, Clock } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative group"
            style={{ backgroundColor: colors.background }}
        >
            {project.mediaGallery && project.mediaGallery[0] && (
                <div className="relative">
                    {project.mediaGallery[0].type === 'image' ? (
                        <img
                            src={project.mediaGallery[0].url}
                            alt={project.title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="relative w-full h-48">
                            <iframe
                                src={project.mediaGallery[0].url}
                                title={project.title}
                                className="w-full h-48"
                                allowFullScreen
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="w-16 h-16 text-white opacity-70" />
                            </div>
                        </div>
                    )}
                    <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            )}

            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: colors.text }}>
                    {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3" style={{ color: colors.text }}>
                    {project.overview}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tools && project.tools.slice(0, 3).map((tool, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-sm rounded-full transform transition-transform hover:scale-105"
                            style={{ backgroundColor: colors.accent, color: '#fff' }}
                        >
                            {tool.name}
                        </span>
                    ))}
                    {project.tools && project.tools.length > 3 && (
                        <span className="px-2 py-1 text-sm rounded-full bg-gray-200 text-gray-700">
                            +{project.tools.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1 text-blue-500" />
                            <span className="text-sm" style={{ color: colors.text }}>
                                {project.analytics?.views || 0}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1 text-red-500" />
                            <span className="text-sm" style={{ color: colors.text }}>
                                {project.analytics?.engagement || 0}
                            </span>
                        </div>
                    </div>
                    <Link
                        to={`/projects/${project._id}`}
                        className="text-sm font-medium px-3 py-1 rounded-full flex items-center hover:bg-blue-50 transition-all"
                        style={{ color: colors.primary }}
                    >
                        View 
                        <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard; 