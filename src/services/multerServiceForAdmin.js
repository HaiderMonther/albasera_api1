const multer = require("multer");
const path = require("path");
const deleteUploadedFiles = require('../utils/functions/deleteUploadedFile');
const { getRelativePath } = require("../utils/functions/images");

// Set up Multer storage with diskStorage for saving files temporarily
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/adminImg"));
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

// File filter to only accept specific formats
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
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
    { name: 'personal_image', maxCount: 1 }
]);

// Middleware to validate files and delete if conditions are not met
const validateAndDeleteAdminImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            if (req.files) deleteUploadedFiles(req.files);
            return res.status(400).json({ message: err.message });
        }

        const files = req.files;
        if (!files || !files.personal_image) {
            if (req.files) deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "عذرا يجب رفع صورة الادمن" });
        }

        // Check the total file size limit of 10MB
        const totalSize = files.personal_image.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 10 * 1024 * 1024) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: 'Total file size exceeds 10MB' });
        }

        // Save the file path in the request body
        req.body['personal_image'] = getRelativePath(files.personal_image[0].path);

        next();
    });
};

module.exports = {
    validateAndDeleteAdminImage
};
