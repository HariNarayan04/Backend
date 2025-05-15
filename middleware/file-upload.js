const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { v1: uuidv1 } = require('uuid');
const HttpError = require('../models/http-error');


// File type map for filtering images
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

// Cloudinary config (ensure these environment variables are set in your environment)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => uuidv1(), // custom filename
    },
});

// Multer middleware with Cloudinary storage
let fileUpload;
try{
    fileUpload = multer({
        limits: { fileSize: 5000000 }, // Limit file size to ~500KB
        storage: storage,
        fileFilter: (req, file, cb) => {
            const isValid = MIME_TYPE_MAP[file.mimetype];
            let error = isValid ? null : new HttpError('Invalid mime type!',500);
            if(error!==null){
                return next(error);
            }
            cb(error, isValid);
        }
    });
}
catch(err){
    const error = new HttpError('Error storing image ', 500);
    return next(error);
}

module.exports = fileUpload;

// const multer = require('multer');
// const { v1: uuidv1 } = require('uuid');
// const MIME_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg',
// };

// const fileUpload = multer({
//     limits: 500000,
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, 'uploads/images');
//         },
//         filename: (req, file, cb) => {
//             const ext = MIME_TYPE_MAP[file.mimetype]
//             cb(null, uuidv1() + '.' + ext);
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype];
//         let error  = isValid ? null : new Error('Invalid mime type !');
//         cb(error, isValid);
//     }
// });


// module.exports = fileUpload;

   