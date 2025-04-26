const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    overview: {
        type: String,
        required: true
    },
    mediaGallery: [{
        type: {
            type: String,
            enum: ['image', 'video'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        caption: String
    }],
    timeline: [{
        date: Date,
        title: String,
        description: String
    }],
    tools: [{
        name: String,
        icon: String
    }],
    outcomes: {
        metrics: [{
            label: String,
            value: String
        }],
        testimonials: [{
            content: String,
            author: String,
            role: String
        }]
    },
    analytics: {
        views: {
            type: Number,
            default: 0
        },
        engagement: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Create slug from title before saving
projectSchema.pre('save', function(next) {
    // Initialize analytics if it doesn't exist
    if (!this.analytics) {
        this.analytics = {
            views: 0,
            engagement: 0
        };
    }
    
    // Only update slug if title is modified or it's a new document
    if (this.isModified('title') || this.isNew) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project; 