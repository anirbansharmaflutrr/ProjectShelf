const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password not required if using Google Auth
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values and ensures uniqueness only for non-null values
    },
    profilePicture: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    socialLinks: {
        website: String,
        github: String,
        linkedin: String,
        twitter: String,
    },
    selectedTheme: {
        type: String,
        default: 'default',
    },
    themeCustomization: {
        primaryColor: String,
        secondaryColor: String,
        accentColor: String,
    },
    // Analytics fields
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginCount: {
        type: Number,
        default: 0
    },
    visitStats: [{
        date: {
            type: Date,
            default: Date.now
        },
        count: {
            type: Number,
            default: 0
        }
    }],
    projectsViewed: [{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        viewCount: {
            type: Number,
            default: 0
        },
        lastViewed: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;