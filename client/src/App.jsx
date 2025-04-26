import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';

// Import pages (to be created next)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthSuccess from './pages/auth/AuthSuccess';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetails from './pages/projects/ProjectDetails';
import CreateProject from './pages/projects/CreateProject';
import EditProject from './pages/projects/EditProject';
import Profile from './pages/profile/Profile';
import Analytics from './pages/analytics/Analytics';
import PublicPortfolio from './pages/portfolio/PublicPortfolio';
import PublicProjectDetails from './pages/projects/PublicProjectDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/auth/success" element={<AuthSuccess />} />
                        <Route path="/:username" element={<PublicPortfolio />} />
                        <Route path="/projects/:id/public" element={<PublicProjectDetails />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Projects />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects/create"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <CreateProject />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects/:id"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <ProjectDetails />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects/:id/edit"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <EditProject />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Profile />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Analytics />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
