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

    // Return the URL and public_id of the uploaded file
    return res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename
    });
  });
});

/**
 * @route DELETE /api/media/:publicId
 * @desc Delete media from Cloudinary
 * @access Private
 */
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);

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