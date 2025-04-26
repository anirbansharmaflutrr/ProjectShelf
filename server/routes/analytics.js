const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const mongoose = require('mongoose');

/**
 * @route   GET /api/analytics/user
 * @desc    Get user analytics
 * @access  Private
 */
router.get('/user', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('loginCount lastLogin visitStats projectsViewed')
            .populate('projectsViewed.projectId', 'title thumbnail');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            loginCount: user.loginCount,
            lastLogin: user.lastLogin,
            visitStats: user.visitStats,
            projectsViewed: user.projectsViewed
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/analytics/page-view
 * @desc    Record a page view
 * @access  Private
 */
router.post('/page-view', protect, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if there's an entry for today
        const existingStatIndex = user.visitStats.findIndex(
            stat => new Date(stat.date).toDateString() === today.toDateString()
        );

        if (existingStatIndex >= 0) {
            // Update existing entry
            user.visitStats[existingStatIndex].count += 1;
        } else {
            // Create new entry for today
            user.visitStats.push({ date: today, count: 1 });
        }

        await user.save();
        res.status(200).json({ message: 'Page view recorded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/analytics/project-view/:projectId
 * @desc    Record a project view
 * @access  Private
 */
router.post('/project-view/:projectId', protect, async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find if project is already in user's viewed list
        const projectViewIndex = user.projectsViewed.findIndex(
            item => item.projectId.toString() === projectId
        );

        if (projectViewIndex >= 0) {
            // Update existing entry
            user.projectsViewed[projectViewIndex].viewCount += 1;
            user.projectsViewed[projectViewIndex].lastViewed = Date.now();
        } else {
            // Add new project to viewed list
            user.projectsViewed.push({
                projectId,
                viewCount: 1,
                lastViewed: Date.now()
            });
        }

        await user.save();
        res.status(200).json({ message: 'Project view recorded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get analytics dashboard data
 * @access  Private
 */
router.get('/dashboard', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('visitStats projectsViewed loginCount lastLogin')
            .populate('projectsViewed.projectId', 'title thumbnail');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get last 30 days visit stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentVisits = user.visitStats.filter(
            stat => new Date(stat.date) >= thirtyDaysAgo
        );

        // Sort projects by view count
        const topProjects = [...user.projectsViewed]
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 5);

        res.json({
            totalVisits: user.visitStats.reduce((sum, stat) => sum + stat.count, 0),
            recentVisits,
            topProjects,
            loginCount: user.loginCount,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;