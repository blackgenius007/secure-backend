const path = require('path');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middleware/async');
const Inmate = require('../models/inmate.js'); 
const cloudinary = require('../utils/cloudinary.js');
const upload = require('../utils/multer.js');

 // @desc Employee Photos
//@acess Private
 
exports.inmatePhotos = asyncHandler(async (req, res, next) => {
  const _id = req.params.inmateId;

  console.log('Inmate detail:', _id);
  console.log('Inmate detail:', req.file);

  try {
    // Check for existing image
    const inmate = await Inmate.findById(_id);

    if (!inmate) {
      return res.status(404).json({ success: false, message: 'Inmate not found' });
    }

    if (inmate.public_id) {
      // Delete existing image from cloudinary
      await cloudinary.v2.uploader.destroy(inmate.public_id, {
        type: 'upload',
        resource_type: 'image'
      });
    }

    // Upload new image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
console.log(result)
    if (!result) {
      return res.status(500).send('Error uploading file to Cloudinary');
    }

    const { secure_url, public_id } = result;

    // Update inmate's imagePath and public_id
    await Inmate.findByIdAndUpdate(
      _id,
      { imagePath: secure_url, public_id: public_id },
      { new: true, fields: { imagePath: 1 } }
    );

    res.json({
      success: true,
      message: 'Image uploaded and inmate details updated successfully',
      imagePath: secure_url
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
