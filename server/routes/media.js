const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure multer and Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projectshelf',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'webm']
  }
});

const upload = multer({ storage: storage });

/**
 * @route POST /api/media/upload
 * @desc Upload media to Cloudinary
 * @access Private
 */
router.post('/upload', protect, function(req, res, next) {
  upload.single('media')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: 'Upload error', error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Determine if the file is a video
    const isVideo = req.file.mimetype.startsWith('video/');
    
    // Get additional information for videos
    if (isVideo) {
      // Return video details including format
      return res.status(200).json({
        url: req.file.path,
        public_id: req.file.filename,
        format: req.file.format || 'mp4',
        resource_type: 'video',
        duration: req.file.duration
      });
    }

    // Return the URL and public_id of the uploaded file
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
      resource_type: 'image'
    });
  });
});

/**
 * @route POST /api/media/video-url
 * @desc Register an external video URL (YouTube, Vimeo)
 * @access Private
 */
router.post('/video-url', protect, async (req, res) => {
  try {
    const { url, thumbnail } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Video URL is required' });
    }
    
    // Validate URL is from YouTube or Vimeo
    const isValidUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/.test(url);
    
    if (!isValidUrl) {
      return res.status(400).json({ message: 'Only YouTube and Vimeo URLs are supported' });
    }
    
    // Upload thumbnail if provided
    let thumbnailData = null;
    if (thumbnail) {
      try {
        const result = await cloudinary.uploader.upload(thumbnail, {
          folder: 'projectshelf/thumbnails'
        });
        thumbnailData = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (error) {
        console.error('Thumbnail upload error:', error);
      }
    }
    
    return res.status(200).json({
      url: url,
      thumbnail: thumbnailData ? thumbnailData.url : null,
      thumbnail_id: thumbnailData ? thumbnailData.public_id : null,
      resource_type: 'video',
      source: url.includes('youtube') ? 'youtube' : url.includes('vimeo') ? 'vimeo' : 'external'
    });
  } catch (error) {
    console.error('Video URL registration error:', error);
    return res.status(500).json({ message: 'Server error during video registration' });
  }
});

/**
 * @route DELETE /api/media/:publicId
 * @desc Delete media from Cloudinary
 * @access Private
 */
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resource_type } = req.query;
    
    // Delete with resource type (image or video)
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type || 'image'
    });

    if (result.result !== 'ok') {
      return res.status(400).json({ message: 'Failed to delete media' });
    }

    return res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Server error during deletion' });
  }
});

module.exports = router; 