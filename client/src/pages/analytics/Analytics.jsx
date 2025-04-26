import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import api from '../../utils/api';
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
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Analytics = () => {
    const { getThemeColors } = useTheme();
    const { projects, loading: projectsLoading, error: projectsError, fetchProjects } = useProjects();
    const [viewsData, setViewsData] = useState([]);
    const [engagementData, setEngagementData] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const colors = getThemeColors();

    // Define colors for pie chart
    const COLORS = [colors.primary, colors.accent, colors.secondary, '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        fetchProjects();
        fetchAnalytics();
    }, [fetchProjects]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/analytics/dashboard');
            setAnalyticsData(data);
            
            // Format the visit data for chart
            if (data.recentVisits && data.recentVisits.length > 0) {
                const formattedVisits = data.recentVisits.map(visit => ({
                    date: new Date(visit.date).toLocaleDateString(),
                    visits: visit.count
                }));
                setViewsData(formattedVisits);
            }

            // Format the project view data for chart
            if (data.topProjects && data.topProjects.length > 0) {
                const formattedProjects = data.topProjects.map(project => ({
                    name: project.projectId?.title || 'Unknown Project',
                    views: project.viewCount
                }));
                setEngagementData(formattedProjects);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projects.length > 0 && !analyticsData) {
            // Fallback to project data if no analytics data is available
            const projectViews = projects.map(project => ({
                name: project.title,
                views: project.analytics?.views || 0,
                engagement: project.analytics?.engagement || 0
            }));

            setViewsData(projectViews);
            setEngagementData(projectViews);
        }
    }, [projects, analyticsData]);

    if (loading || projectsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
            </div>
        );
    }

    if (error || projectsError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error || projectsError}</p>
            </div>
        );
    }

    const totalViews = analyticsData?.totalVisits || 0;
    const loginCount = analyticsData?.loginCount || 0;
    const lastLogin = analyticsData?.lastLogin 
        ? new Date(analyticsData.lastLogin).toLocaleDateString() 
        : 'N/A';

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                User Analytics Dashboard
            </h1>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Total Page Views
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {totalViews}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Total Login Count
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {loginCount}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Last Login
                    </h3>
                    <p className="text-xl font-bold" style={{ color: colors.primary }}>
                        {lastLogin}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        Projects Viewed
                    </h3>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                        {analyticsData?.topProjects?.length || 0}
                    </p>
                </div>
            </div>

            {/* Views Chart - Area Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                    Daily Page Views (Last 30 Days)
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date"
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
                            <Area 
                                type="monotone" 
                                dataKey="visits" 
                                fill={colors.primary} 
                                stroke={colors.primary} 
                                name="Page Views"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Project Views - Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                        Top Projects by Views
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={engagementData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="views"
                                    nameKey="name"
                                >
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        border: `1px solid ${colors.primary}`
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Projects Bar Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                        Project Views Distribution
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData}>
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
                                <Bar dataKey="views" fill={colors.accent} name="Views" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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
                                    Last Viewed
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analyticsData?.topProjects?.map(project => {
                                const lastViewed = new Date(project.lastViewed).toLocaleDateString();

                                return (
                                    <tr key={project.projectId?._id || index}>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {project.projectId?.title || 'Unknown Project'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {project.viewCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                                            {lastViewed}
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!analyticsData?.topProjects || analyticsData.topProjects.length === 0) && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center" style={{ color: colors.text }}>
                                        No project view data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;