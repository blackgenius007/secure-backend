const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

 

// Configure storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatar' // Folder in Cloudinary where the image will be stored
  }
});

const upload = multer({ storage: storage });

const {
 
  inmatePhotos,
 
} = require('../controllers/images');

 

router
  .route('/upload/:inmateId')
  .post(upload.single('file'), inmatePhotos);

 

module.exports = router;
