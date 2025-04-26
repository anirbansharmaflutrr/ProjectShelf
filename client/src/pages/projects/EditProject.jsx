import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import useProjects from '../../hooks/useProjects';
import { uploadMedia } from '../../utils/cloudinary';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getThemeColors } = useTheme();
    const { getProjectById, updateProject } = useProjects();
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
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [uploadingMedia, setUploadingMedia] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project = await getProjectById(id);
                setFormData({
                    title: project.title,
                    overview: project.overview,
                    tools: project.tools || [],
                    timeline: project.timeline || [],
                    mediaGallery: project.mediaGallery || [],
                    outcomes: {
                        metrics: project.outcomes?.metrics || [],
                        testimonials: project.outcomes?.testimonials || []
                    }
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, getProjectById]);

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
        setSaving(true);
        setError(null);

        try {
            await updateProject(id, formData);
            navigate(`/projects/${id}`);
        } catch (error) {
            setError(error.message);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => navigate('/projects')} className="mt-4">
                    Back to Projects
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.background }}>
                <h1 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                    Edit Project
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <Input
                            label="Project Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>
                                Project Overview
                            </label>
                            <textarea
                                name="overview"
                                value={formData.overview}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    '--tw-ring-color': colors.primary
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* Media Gallery */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Media Gallery</h2>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleMediaUpload}
                                className="hidden"
                                id="media-upload"
                            />
                            <label htmlFor="media-upload">
                                <Button
                                    as="span"
                                    variant="secondary"
                                    loading={uploadingMedia}
                                >
                                    Upload Media
                                </Button>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.mediaGallery.map((media, index) => (
                                    <div key={index} className="relative">
                                        {media.type === 'image' ? (
                                            <img
                                                src={media.url}
                                                alt=""
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <iframe
                                                src={media.url}
                                                className="w-full h-48 rounded-lg"
                                                title={`Media ${index + 1}`}
                                            />
                                        )}
                                        <input
                                            type="text"
                                            value={media.caption}
                                            onChange={(e) => handleMediaCaptionChange(index, e.target.value)}
                                            placeholder="Add caption"
                                            className="mt-2 w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.text,
                                                '--tw-ring-color': colors.primary
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleMediaRemove(index)}
                                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tools */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Tools & Technologies</h2>
                            <Button type="button" variant="secondary" onClick={handleToolAdd}>
                                Add Tool
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.tools.map((tool, index) => (
                                <div key={index} className="flex gap-4">
                                    <Input
                                        value={tool.name}
                                        onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                                        placeholder="Tool name"
                                    />
                                    <Input
                                        value={tool.icon}
                                        onChange={(e) => handleToolChange(index, 'icon', e.target.value)}
                                        placeholder="Icon URL (optional)"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleToolRemove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>Project Timeline</h2>
                            <Button type="button" variant="secondary" onClick={handleTimelineAdd}>
                                Add Event
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.timeline.map((event, index) => (
                                <div key={index} className="space-y-2">
                                    <Input
                                        type="date"
                                        value={event.date}
                                        onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                                    />
                                    <Input
                                        value={event.title}
                                        onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                        placeholder="Event title"
                                    />
                                    <textarea
                                        value={event.description}
                                        onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                        placeholder="Event description"
                                        className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            '--tw-ring-color': colors.primary
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleTimelineRemove(index)}
                                    >
                                        Remove Event
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Outcomes */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Project Outcomes</h2>

                        {/* Metrics */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-semibold" style={{ color: colors.text }}>Key Metrics</h3>
                                <Button type="button" variant="secondary" onClick={handleMetricAdd}>
                                    Add Metric
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {formData.outcomes.metrics.map((metric, index) => (
                                    <div key={index} className="flex gap-4">
                                        <Input
                                            value={metric.label}
                                            onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                                            placeholder="Metric label"
                                        />
                                        <Input
                                            value={metric.value}
                                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                            placeholder="Metric value"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => handleMetricRemove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-semibold" style={{ color: colors.text }}>Testimonials</h3>
                                <Button type="button" variant="secondary" onClick={handleTestimonialAdd}>
                                    Add Testimonial
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {formData.outcomes.testimonials.map((testimonial, index) => (
                                    <div key={index} className="space-y-2">
                                        <textarea
                                            value={testimonial.content}
                                            onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                                            placeholder="Testimonial content"
                                            className="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.text,
                                                '--tw-ring-color': colors.primary
                                            }}
                                        />
                                        <Input
                                            value={testimonial.author}
                                            onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                                            placeholder="Author name"
                                        />
                                        <Input
                                            value={testimonial.role}
                                            onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                                            placeholder="Author role"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => handleTestimonialRemove(index)}
                                        >
                                            Remove Testimonial
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(`/projects/${id}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProject; 