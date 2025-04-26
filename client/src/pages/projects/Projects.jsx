import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/projects/ProjectCard';

const Projects = () => {
    const { getThemeColors } = useTheme();
    const { projects, loading, error, fetchProjects } = useProjects();
    const colors = getThemeColors();

    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        let result = [...projects];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.overview.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'most-viewed':
                    return (b.analytics?.views || 0) - (a.analytics?.views || 0);
                case 'most-engaged':
                    return (b.analytics?.engagement || 0) - (a.analytics?.engagement || 0);
                default:
                    return 0;
            }
        });

        setFilteredProjects(result);
    }, [projects, searchTerm, sortBy]);

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
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchProjects} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
                    My Projects
                </h1>
                <Link to="/projects/create">
                    <Button>Create New Project</Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                    style={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        '--tw-ring-color': colors.primary
                    }}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                    style={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        '--tw-ring-color': colors.primary
                    }}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most-viewed">Most Viewed</option>
                    <option value="most-engaged">Most Engaged</option>
                </select>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm" style={{ backgroundColor: colors.background }}>
                    {searchTerm ? (
                        <>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                                No projects found
                            </h3>
                            <p className="text-gray-600 mb-4" style={{ color: colors.text }}>
                                Try adjusting your search terms
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                                No projects yet
                            </h3>
                            <p className="text-gray-600 mb-4" style={{ color: colors.text }}>
                                Start by creating your first project
                            </p>
                            <Link to="/projects/create">
                                <Button>Create Project</Button>
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects; 