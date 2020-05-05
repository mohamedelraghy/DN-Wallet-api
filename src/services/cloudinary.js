const cloudinary = require('cloudinary').v2;

async function cloudinaryUpload(path) {
  return await cloudinary.uploader.upload(path, {
    resource_type: 'auto',
    use_filename: true,
  });
}

module.exports = cloudinaryUpload;