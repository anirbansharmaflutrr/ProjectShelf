import { useState, useCallback } from 'react';
import api from '../utils/api';

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/projects');
            setProjects(data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async (projectData) => {
        setLoading(true);
        try {
            const { data } = await api.post('/api/projects', projectData);
            setProjects([...projects, data]);
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create project');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id, projectData) => {
        setLoading(true);
        try {
            const { data } = await api.put(`/api/projects/${id}`, projectData);
            setProjects(projects.map(p => p._id === id ? data : p));
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update project');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        setLoading(true);
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete project');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getProjectById = async (id) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/api/projects/${id}`);
            setError(null);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch project');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const incrementEngagement = async (id) => {
        try {
            const { data } = await api.put(`/api/projects/${id}/engagement`);
            return data;
        } catch (error) {
            console.error('Failed to increment engagement:', error);
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        getProjectById,
        incrementEngagement
    };
};

export default useProjects; 