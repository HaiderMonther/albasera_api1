const { getRelativePath } = require("../utils/functions/images");
const fs = require("fs");

function validateImages(req, res, next) {

    if (Object.keys(req.files).length == 0)
        return res.status(400).json({ message: "عذرا يجب رفع المستمسكات المطلوبة" });

    if (Object.keys(req.files).length != 3) {

        if (req.files.image_1 != undefined) {
            fs.unlinkSync(req.files.image_1[0].path);
        }

        if (req.files.image_2 != undefined) {

            fs.unlinkSync(req.files.image_2[0].path);
        }

        if (req.files.image_3 != undefined) {
            fs.unlinkSync(req.files.image_3[0].path);
        }
    }


    if (req.fileValidationError == true) {

        fs.unlinkSync(req.files.image_1[0].path);
        fs.unlinkSync(req.files.image_2[0].path);
        fs.unlinkSync(req.files.image_3[0].path);

        return res.status(400).json({ message: req.fileValidationMsg });

    }

    if (Object.keys(req.files).length != 0 && Object.keys(req.files).length == 3) {

        if (req.files.image_1[0].size > 1024 * 1024 * 10 ||
            req.files.image_2[0].size > 1024 * 1024 * 10 ||
            req.files.image_3[0].size > 1024 * 1024 * 10) {
            fs.unlinkSync(req.files.image_1[0].path);
            fs.unlinkSync(req.files.image_2[0].path);
            fs.unlinkSync(req.files.image_3[0].path);
            return res.status(400).json({ message: "حجم الصور المرفوعة كبير جدا يرجى تخفيض الحجم لأقل من 10MB لكل صورة" });
        }
    } else {
        fs.unlinkSync(req.files.image_1[0].path);
        fs.unlinkSync(req.files.image_2[0].path);
        fs.unlinkSync(req.files.image_3[0].path);
        return res.status(400).json({ message: "يرجى التأكد من رفع جميع المستمسكات المطلوبة" });
    }

    req.body['image_1'] = getRelativePath(req.files.image_1[0].path);
    req.body['image_2'] = getRelativePath(req.files.image_2[0].path);
    req.body['image_3'] = getRelativePath(req.files.image_3[0].path);
    return next()
}



module.exports = {
    validateImages,
}