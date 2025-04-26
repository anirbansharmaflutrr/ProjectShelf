const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio || user.bio;
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            user.socialLinks = req.body.socialLinks || user.socialLinks;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                socialLinks: updatedUser.socialLinks
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/users/theme
// @desc    Update user theme preferences
// @access  Private
router.put('/theme', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.selectedTheme = req.body.selectedTheme || user.selectedTheme;
            user.themeCustomization = req.body.themeCustomization || user.themeCustomization;

            const updatedUser = await user.save();

            res.json({
                selectedTheme: updatedUser.selectedTheme,
                themeCustomization: updatedUser.themeCustomization
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/:username
// @desc    Get user by username (public profile)
// @access  Public
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password -email');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 