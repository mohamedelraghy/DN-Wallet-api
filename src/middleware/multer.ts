const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);


    if (mimeType) return cb(null, true);

    cb("Error: File upload only supports the "
        + "following filetypes - " + fileTypes);
}

const upload = multer({

    storage: storage,
    limits: {
        fileSize: 1024 * 1042 * 5
    },
    fileFilter: fileFilter
});

module.exports = upload.any();