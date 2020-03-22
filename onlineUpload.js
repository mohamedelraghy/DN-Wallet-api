const cloudinary = require('cloudinary');
const config = require('config');

cloudinary.config({
    cloud_name: 'ddsxppshz',
    api_key: '446749512425323',
    api_secret: 'ude_kBk0KUG1tDcBHh9S6koHtF8'
});


exports.uploads = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.uploads(file, (res) =>{
            resolve({url: res.url, id: res.public_id})
        }, {resource_type: "auto"})
    })
}
