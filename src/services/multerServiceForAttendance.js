const multer = require("multer");
const path = require("path");
const deleteUploadedFiles = require('../utils/functions/deleteUploadedFile');
const { getRelativePath } = require("../utils/functions/images")
// Set up Multer storage with diskStorage for saving files temporarily
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/attendance_images"))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

// File filter to only accept specific formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/PNG', 'image/png', 'image/JPG', 'image/JPEG', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("يجب رفع صور من نوع jpg او png فقط"), false);
    }
};

// Initialize Multer with storage and file filter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Individual file size limit of 10MB
}).fields([
    { name: 'image', maxCount: 1 }
]);

// Middleware to validate files and delete if conditions are not met
const validateAndDeleteImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: err.message });
        }

        const files = req.files;
        if (!files || !files.image) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "عذرا يجب رفع صورة الحضور" });
        }

        // Check the total file size limit of 10MB
        const totalSize = files.image[0].size;
        if (totalSize > 10 * 1024 * 1024) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: 'Total file size exceeds 10MB' });
        }

        req.body['image'] = getRelativePath(req.files.image[0].path);

        next();
    });
};


module.exports = {
    validateAndDeleteImage
}