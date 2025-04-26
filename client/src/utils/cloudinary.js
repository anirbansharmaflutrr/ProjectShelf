import api from './api';

export const uploadMedia = async (file, onProgress = () => {}) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('media', file);

    try {
        onProgress(0);
        
        const { data } = await api.post('/api/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            },
        });

        onProgress(100);
        return data;
    } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
    }
};

export const registerVideoUrl = async (url, thumbnail = null) => {
    try {
        const { data } = await api.post('/api/media/video-url', { 
            url, 
            thumbnail 
        });
        return data;
    } catch (error) {
        console.error('Error registering video URL:', error);
        throw error;
    }
};

export const deleteMedia = async (publicId, resourceType = 'image') => {
    try {
        await api.delete(`/api/media/${publicId}?resource_type=${resourceType}`);
        return true;
    } catch (error) {
        console.error('Error deleting media:', error);
        throw error;
    }
};

// Helper function to determine if a URL is a video
export const isVideoUrl = (url) => {
    if (!url) return false;
    
    // Check for video file extensions
    if (url.match(/\.(mp4|webm|mov)$/i)) return true;
    
    // Check for video hosting platforms
    if (
        url.includes('youtube.com') || 
        url.includes('youtu.be') || 
        url.includes('vimeo.com')
    ) return true;
    
    return false;
};

// Extract YouTube or Vimeo video ID
export const getVideoId = (url) => {
    if (!url) return null;
    
    // YouTube formats
    let match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) return { id: match[1], platform: 'youtube' };
    
    // Vimeo formats
    match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match && match[1]) return { id: match[1], platform: 'vimeo' };
    
    return null;
};

// Generate thumbnail URL for videos
export const getVideoThumbnail = (url) => {
    const videoInfo = getVideoId(url);
    if (!videoInfo) return null;
    
    if (videoInfo.platform === 'youtube') {
        return `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`;
    } else if (videoInfo.platform === 'vimeo') {
        // Vimeo requires an API call to get the thumbnail
        // We'll return null and handle this separately if needed
        return null;
    }
    
    return null;
};

export default {
    uploadMedia,
    registerVideoUrl,
    deleteMedia,
    isVideoUrl,
    getVideoId,
    getVideoThumbnail
};