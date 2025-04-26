import api from './api';

/**
 * Upload a file to Cloudinary through our server
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The uploaded file details
 */
export const uploadMedia = async (file) => {
    try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('media', file);

        // Send the file to our server, which will handle the Cloudinary upload
        const response = await api.post('/api/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return {
            url: response.data.url,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            public_id: response.data.public_id
        };
    } catch (error) {
        console.error('Error uploading media:', error);
        throw new Error('Failed to upload media. Please try again.');
    }
};

/**
 * Delete a file from Cloudinary through our server
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - The result of the deletion
 */
export const deleteMedia = async (publicId) => {
    try {
        const response = await api.delete(`/api/media/${publicId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting media:', error);
        throw new Error('Failed to delete media. Please try again.');
    }
}; 