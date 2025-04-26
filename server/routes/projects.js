const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const project = new Project({
            user: req.user._id,
            ...req.body
        });

        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        console.error('Project creation error:', error);
        // Send more specific error for debugging
        res.status(500).json({ 
            message: 'Server error while creating project', 
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('user', 'username');
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Increment views
        project.analytics.views += 1;
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns project
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Make sure user owns project
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await project.remove();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/projects/:id/engagement
// @desc    Increment engagement count
// @access  Public
router.put('/:id/engagement', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.analytics.engagement += 1;
        await project.save();

        res.json(project.analytics);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 