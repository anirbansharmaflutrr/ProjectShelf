import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import { uploadMedia } from '../../utils/cloudinary';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
    Image, 
    Paperclip, 
    Trash2, 
    Plus, 
    Calendar, 
    Wrench, 
    Clock, 
    Award, 
    LineChart, 
    MessageSquareQuote, 
    X, 
    Save, 
    ArrowLeft,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

const CreateProject = () => {
    const navigate = useNavigate();
    const { getThemeColors } = useTheme();
    const { createProject } = useProjects();
    const colors = getThemeColors();

    const [formData, setFormData] = useState({
        title: '',
        overview: '',
        tools: [],
        timeline: [],
        mediaGallery: [],
        outcomes: {
            metrics: [],
            testimonials: []
        },
        analytics: {
            views: 0,
            engagement: 0
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [success, setSuccess] = useState(false);

    const steps = [
        { name: 'Basics', description: 'Project info' },
        { name: 'Media', description: 'Images & Videos' },
        { name: 'Details', description: 'Tools & Timeline' },
        { name: 'Outcomes', description: 'Results & Testimonials' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToolAdd = () => {
        setFormData(prev => ({
            ...prev,
            tools: [...prev.tools, { name: '', icon: '' }]
        }));
    };

    const handleToolChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.map((tool, i) =>
                i === index ? { ...tool, [field]: value } : tool
            )
        }));
    };

    const handleToolRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.filter((_, i) => i !== index)
        }));
    };

    const handleTimelineAdd = () => {
        setFormData(prev => ({
            ...prev,
            timeline: [...prev.timeline, { date: '', title: '', description: '' }]
        }));
    };

    const handleTimelineChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline.map((event, i) =>
                i === index ? { ...event, [field]: value } : event
            )
        }));
    };

    const handleTimelineRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index)
        }));
    };

    const handleMediaUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploadingMedia(true);

        try {
            const uploadPromises = files.map(file => uploadMedia(file));
            const results = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                mediaGallery: [
                    ...prev.mediaGallery,
                    ...results.map(result => ({
                        type: result.type,
                        url: result.url,
                        caption: ''
                    }))
                ]
            }));
        } catch (error) {
            setError('Failed to upload media');
        } finally {
            setUploadingMedia(false);
        }
    };

    const handleMediaCaptionChange = (index, caption) => {
        setFormData(prev => ({
            ...prev,
            mediaGallery: prev.mediaGallery.map((media, i) =>
                i === index ? { ...media, caption } : media
            )
        }));
    };

    const handleMediaRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaGallery: prev.mediaGallery.filter((_, i) => i !== index)
        }));
    };

    const handleMetricAdd = () => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                metrics: [...prev.outcomes.metrics, { label: '', value: '' }]
            }
        }));
    };

    const handleMetricChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                metrics: prev.outcomes.metrics.map((metric, i) =>
                    i === index ? { ...metric, [field]: value } : metric
                )
            }
        }));
    };

    const handleMetricRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                metrics: prev.outcomes.metrics.filter((_, i) => i !== index)
            }
        }));
    };

    const handleTestimonialAdd = () => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                testimonials: [...prev.outcomes.testimonials, { content: '', author: '', role: '' }]
            }
        }));
    };

    const handleTestimonialChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                testimonials: prev.outcomes.testimonials.map((testimonial, i) =>
                    i === index ? { ...testimonial, [field]: value } : testimonial
                )
            }
        }));
    };

    const handleTestimonialRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            outcomes: {
                ...prev.outcomes,
                testimonials: prev.outcomes.testimonials.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const project = await createProject(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/projects/${project._id}`);
            }, 1500);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setActiveStep(stepIndex);
        }
    };

    const goNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        }
    };

    const goPrevious = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    if (success) {
        return (
            <div className="max-w-4xl mx-auto my-12 text-center">
                <div className="bg-white rounded-xl shadow-md p-12" style={{ backgroundColor: colors.background }}>
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                        Project Created Successfully!
                    </h1>
                    <p className="text-gray-600 mb-8" style={{ color: colors.text }}>
                        Redirecting you to your new project...
                    </p>
                    <div className="h-2 max-w-xs mx-auto bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r rounded-xl shadow-lg p-8 text-white" 
                style={{ 
                    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
                }}>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                    <Sparkles className="mr-2 h-6 w-6" />
                    Create New Project
                </h1>
                <p className="text-white text-opacity-80 max-w-2xl">
                    Showcase your creativity and skills by adding a new project to your portfolio. Fill in the details below to get started.
                </p>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl shadow-md p-6" style={{ backgroundColor: colors.background }}>
                <div className="flex flex-wrap justify-between">
                    {steps.map((step, index) => (
                        <button
                            key={index}
                            onClick={() => goToStep(index)}
                            className={`flex-1 min-w-[150px] text-center p-4 border-b-2 transition-all ${
                                activeStep === index 
                                    ? 'border-b-2 font-medium' 
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                            style={{ 
                                borderColor: activeStep === index ? colors.primary : undefined,
                                color: activeStep === index ? colors.primary : undefined
                            }}
                        >
                            <div className="flex items-center justify-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 ${
                                    activeStep === index 
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`} style={{ 
                                    backgroundColor: activeStep === index ? colors.primary : undefined 
                                }}>
                                    {index + 1}
                                </span>
                                <span>{step.name}</span>
                            </div>
                            <span className="text-xs block mt-1 text-gray-500">{step.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-md p-8" style={{ backgroundColor: colors.background }}>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Form content will be divided into steps */}
                    {activeStep === 0 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                                Basic Information
                            </h2>
                            
                            <div className="bg-gray-50 rounded-lg p-6" style={{ backgroundColor: `${colors.primary}05` }}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                        Project Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full text-xl font-semibold px-4 py-3 rounded-lg border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            ringColor: colors.primary,
                                            '--tw-ring-color': `${colors.primary}30`,
                                            '--tw-ring-color-focus': colors.primary
                                        }}
                                        placeholder="Enter a descriptive title for your project"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                        Project Overview
                                    </label>
                                    <textarea
                                        name="overview"
                                        value={formData.overview}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            ringColor: colors.primary,
                                            '--tw-ring-color': `${colors.primary}30`,
                                            '--tw-ring-color-focus': colors.primary
                                        }}
                                        placeholder="Describe your project, its purpose, your role, and what you accomplished..."
                                        required
                                    />
                                    
                                    <p className="mt-2 text-sm text-gray-500">
                                        Tip: A good overview is concise yet comprehensive. Include key information about the project's goals, challenges, and your approach.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                <Image className="h-5 w-5 mr-2 text-blue-500" />
                                Media Gallery
                            </h2>
                            
                            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed" style={{ 
                                backgroundColor: `${colors.primary}05`,
                                borderColor: `${colors.primary}30`
                            }}>
                                <div className="text-center py-8">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleMediaUpload}
                                        className="hidden"
                                        id="media-upload"
                                    />
                                    <div className="mb-4">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                                            <Paperclip className="h-8 w-8" style={{ color: colors.primary }} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                                        Drag & Drop or Browse
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                                        Add images and videos to showcase your project. You can upload multiple files at once.
                                    </p>
                                    <label htmlFor="media-upload">
                                        <Button
                                            as="span"
                                            loading={uploadingMedia}
                                            className="px-5 py-2.5"
                                        >
                                            Upload Media Files
                                        </Button>
                                    </label>
                                </div>
                            </div>

                            {formData.mediaGallery.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium mb-4" style={{ color: colors.text }}>
                                        Uploaded Media ({formData.mediaGallery.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {formData.mediaGallery.map((media, index) => (
                                            <div key={index} className="relative bg-white rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-shadow" style={{ backgroundColor: colors.background }}>
                                                {media.type === 'image' ? (
                                                    <div className="aspect-video overflow-hidden">
                                                        <img
                                                            src={media.url}
                                                            alt=""
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video overflow-hidden">
                                                        <iframe
                                                            src={media.url}
                                                            className="w-full h-full"
                                                            title={`Media ${index + 1}`}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <input
                                                        type="text"
                                                        value={media.caption}
                                                        onChange={(e) => handleMediaCaptionChange(index, e.target.value)}
                                                        placeholder="Add caption or description..."
                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.text,
                                                            '--tw-ring-color': `${colors.primary}30`
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMediaRemove(index)}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeStep === 2 && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Tools & Technologies Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                    <Wrench className="h-5 w-5 mr-2 text-blue-500" />
                                    Tools & Technologies
                                </h2>
                                
                                <div className="bg-gray-50 rounded-lg p-6" style={{ backgroundColor: `${colors.primary}05` }}>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.tools.map((tool, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-white inline-flex items-center px-3 py-1.5 rounded-full shadow-sm group"
                                                style={{ backgroundColor: colors.background }}
                                            >
                                                <span className="font-medium mr-2" style={{ color: colors.text }}>{tool.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToolRemove(index)}
                                                    className="p-0.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {formData.tools.length === 0 && (
                                            <p className="text-gray-500 italic">No tools added yet. Use the form below to add technologies used in your project.</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-4 mt-6">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                Tool/Technology Name
                                            </label>
                                            <input
                                                type="text"
                                                id="new-tool-name"
                                                className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                style={{
                                                    backgroundColor: colors.background,
                                                    color: colors.text,
                                                    '--tw-ring-color': `${colors.primary}30`
                                                }}
                                                placeholder="React, Node.js, Photoshop, etc."
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                Icon URL (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="new-tool-icon"
                                                className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                style={{
                                                    backgroundColor: colors.background,
                                                    color: colors.text,
                                                    '--tw-ring-color': `${colors.primary}30`
                                                }}
                                                placeholder="https://example.com/icon.svg"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const nameInput = document.getElementById('new-tool-name');
                                                    const iconInput = document.getElementById('new-tool-icon');
                                                    if (nameInput && nameInput.value.trim()) {
                                                        handleToolAdd();
                                                        handleToolChange(formData.tools.length, 'name', nameInput.value);
                                                        handleToolChange(formData.tools.length, 'icon', iconInput?.value || '');
                                                        nameInput.value = '';
                                                        if (iconInput) iconInput.value = '';
                                                    }
                                                }}
                                                className="mb-0 px-3 py-2"
                                            >
                                                <Plus className="h-5 w-5" />
                                                Add Tool
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Timeline Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                                    Project Timeline
                                </h2>
                                
                                <div className="bg-gray-50 rounded-lg p-6" style={{ backgroundColor: `${colors.primary}05` }}>
                                    {formData.timeline.length > 0 ? (
                                        <div className="relative">
                                            <div className="absolute left-8 top-8 bottom-0 w-0.5" style={{ backgroundColor: colors.primary }}></div>
                                            
                                            <div className="space-y-8">
                                                {formData.timeline.map((event, index) => (
                                                    <div key={index} className="relative pl-16 group">
                                                        <div className="absolute left-6 top-2 w-4 h-4 rounded-full transform -translate-x-1/2 z-10" style={{ backgroundColor: colors.primary }}></div>
                                                        
                                                        <div className="bg-white rounded-lg shadow-sm p-4 relative hover:shadow-md transition-shadow" style={{ backgroundColor: colors.background }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTimelineRemove(index)}
                                                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                <div className="md:col-span-1">
                                                                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                                        Date
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        value={event.date}
                                                                        onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                                        style={{
                                                                            backgroundColor: colors.background,
                                                                            color: colors.text,
                                                                            '--tw-ring-color': `${colors.primary}30`
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-1">
                                                                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                                        Event Title
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={event.title}
                                                                        onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                                                        placeholder="Milestone title"
                                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                                        style={{
                                                                            backgroundColor: colors.background,
                                                                            color: colors.text,
                                                                            '--tw-ring-color': `${colors.primary}30`
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                                        Description
                                                                    </label>
                                                                    <textarea
                                                                        value={event.description}
                                                                        onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                                                        placeholder="What happened at this milestone"
                                                                        rows={2}
                                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                                        style={{
                                                                            backgroundColor: colors.background,
                                                                            color: colors.text,
                                                                            '--tw-ring-color': `${colors.primary}30`
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-500 mb-4">No timeline events added yet.</p>
                                        </div>
                                    )}
                                    
                                    <div className="mt-6 text-center">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                handleTimelineAdd();
                                                // Focus the date input of the newly added timeline event
                                                setTimeout(() => {
                                                    const allDateInputs = document.querySelectorAll('input[type="date"]');
                                                    const lastDateInput = allDateInputs[allDateInputs.length - 1];
                                                    if (lastDateInput) lastDateInput.focus();
                                                }, 100);
                                            }}
                                            variant="secondary"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Timeline Event
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeStep === 3 && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Metrics Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                    <LineChart className="h-5 w-5 mr-2 text-blue-500" />
                                    Key Metrics
                                </h2>
                                
                                <div className="bg-gray-50 rounded-lg p-6" style={{ backgroundColor: `${colors.primary}05` }}>
                                    <p className="text-gray-600 mb-4" style={{ color: colors.text }}>
                                        Add quantifiable results and achievements from your project to demonstrate its success.
                                    </p>
                                    
                                    {formData.outcomes.metrics.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {formData.outcomes.metrics.map((metric, index) => (
                                                <div 
                                                    key={index} 
                                                    className="bg-white rounded-lg shadow-sm p-4 relative group hover:shadow-md transition-shadow"
                                                    style={{ backgroundColor: colors.background }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMetricRemove(index)}
                                                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={metric.label}
                                                        onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                                                        placeholder="Metric name"
                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all text-sm mb-2"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.text,
                                                            '--tw-ring-color': `${colors.primary}30`
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={metric.value}
                                                        onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                                        placeholder="Value (e.g. '10% increase')"
                                                        className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all text-lg font-semibold"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.primary,
                                                            '--tw-ring-color': `${colors.primary}30`
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 mb-4 border-2 border-dashed rounded-lg" style={{ borderColor: `${colors.primary}30` }}>
                                            <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-500">No metrics added yet.</p>
                                        </div>
                                    )}
                                    
                                    <Button
                                        type="button"
                                        onClick={handleMetricAdd}
                                        variant="secondary"
                                        className="w-full justify-center"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Metric
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Testimonials Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: colors.text }}>
                                    <MessageSquareQuote className="h-5 w-5 mr-2 text-blue-500" />
                                    Testimonials
                                </h2>
                                
                                <div className="bg-gray-50 rounded-lg p-6" style={{ backgroundColor: `${colors.primary}05` }}>
                                    <p className="text-gray-600 mb-4" style={{ color: colors.text }}>
                                        Add feedback from clients, teammates, or users who interacted with your project.
                                    </p>
                                    
                                    {formData.outcomes.testimonials.length > 0 ? (
                                        <div className="space-y-6 mb-6">
                                            {formData.outcomes.testimonials.map((testimonial, index) => (
                                                <div 
                                                    key={index} 
                                                    className="bg-white rounded-lg shadow-sm p-5 relative group hover:shadow-md transition-shadow border-l-4"
                                                    style={{ 
                                                        backgroundColor: colors.background,
                                                        borderLeftColor: colors.primary
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTestimonialRemove(index)}
                                                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                            Testimonial Content
                                                        </label>
                                                        <textarea
                                                            value={testimonial.content}
                                                            onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                                                            placeholder="What they said about your project..."
                                                            rows={3}
                                                            className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all italic"
                                                            style={{
                                                                backgroundColor: colors.background,
                                                                color: colors.text,
                                                                '--tw-ring-color': `${colors.primary}30`
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                                Author Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={testimonial.author}
                                                                onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                                                                placeholder="Who provided this feedback"
                                                                className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                                style={{
                                                                    backgroundColor: colors.background,
                                                                    color: colors.text,
                                                                    '--tw-ring-color': `${colors.primary}30`
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                                                Role/Position
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={testimonial.role}
                                                                onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                                                                placeholder="Their job title or relationship"
                                                                className="w-full px-3 py-2 rounded-md border-0 shadow-sm ring-1 ring-inset transition-all"
                                                                style={{
                                                                    backgroundColor: colors.background,
                                                                    color: colors.text,
                                                                    '--tw-ring-color': `${colors.primary}30`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 mb-4 border-2 border-dashed rounded-lg" style={{ borderColor: `${colors.primary}30` }}>
                                            <MessageSquareQuote className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-500">No testimonials added yet.</p>
                                        </div>
                                    )}
                                    
                                    <Button
                                        type="button"
                                        onClick={handleTestimonialAdd}
                                        variant="secondary"
                                        className="w-full justify-center"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Testimonial
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                                <h3 className="text-lg font-medium mb-2 text-blue-700">Ready to create your project?</h3>
                                <p className="text-blue-600 mb-0">
                                    You're almost done! Review your project details and click the "Create Project" button below when you're ready to publish.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-red-700 text-sm">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={activeStep === 0 ? () => navigate('/projects') : goPrevious}
                        >
                            {activeStep === 0 ? (
                                <>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Projects
                                </>
                            ) : (
                                'Previous Step'
                            )}
                        </Button>
                        
                        {activeStep < steps.length - 1 ? (
                            <Button
                                type="button"
                                onClick={goNext}
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                loading={loading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Create Project
                            </Button>
                        )}
                    </div>
                </form>
            </div>
            
            {/* Animation styles */}
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CreateProject; 