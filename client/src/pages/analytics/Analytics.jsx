import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Analytics = () => {
    const { getThemeColors } = useTheme();
    const { projects, loading, error, fetchProjects } = useProjects();
    const [viewsData, setViewsData] = useState([]);
    const [engagementData, setEngagementData] = useState([]);
    const colors = getThemeColors();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (projects.length > 0) {
            // Process projects data for charts
            const projectViews = projects.map(project => ({
                name: project.title,
                views: project.analytics?.views || 0,
                engagement: project.analytics?.engagement || 0
            }));

            setViewsData(projectViews);
            setEngagementData(projectViews);
        }
    }, [projects]);

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
            </div>
        );
    }

    const totalViews = projects.reduce((sum, project) => sum + (project.analytics?.views || 0), 0);
    const totalEngagements = projects.reduce((sum, project) => sum + (project.analytics?.engagement || 0), 0);
    const averageEngagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(2) : 0;

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Total Views
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {totalViews}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Total Engagements
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {totalEngagements}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Engagement Rate
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {averageEngagementRate}%
                    </p>
                </div>
            </div>

            {/* Views Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Project Views
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: colors.text }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis tick={{ fill: colors.text }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    border: `1px solid ${colors.primary}`
                                }}
                            />
                            <Legend />
                            <Bar dataKey="views" fill={colors.primary} name="Views" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Engagement Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Project Engagement
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: colors.text }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis tick={{ fill: colors.text }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    border: `1px solid ${colors.accent}`
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="engagement"
                                stroke={colors.accent}
                                name="Engagement"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Project Performance Table */}
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Project Performance
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.text }}>
                                    Project
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.text }}>
                                    Views
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.text }}>
                                    Engagements
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.text }}>
                                    Engagement Rate
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {projects.map(project => {
                                const views = project.analytics?.views || 0;
                                const engagement = project.analytics?.engagement || 0;
                                const rate = views > 0 ? ((engagement / views) * 100).toFixed(2) : 0;

                                return (
                                    <tr key={project._id}>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {project.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {views}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {engagement}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {rate}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 