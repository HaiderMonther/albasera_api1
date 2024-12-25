const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminsSchema = new Schema({
    username: {
        type: String,
        required: [true, 'اسم الآدمن مطلوب'],
        unique: true,
    },
    password: {
        type: String, // تغيير النوع إلى String
        required: [true, 'كلمة المرور مطلوبة'],
    },
    full_name: {
        type: String,
        required: [true, "اسم الكامل للآدمن مطلوب"]
    },
    personal_image: {
        type: String,
        required: [true, "الصورة الشخصية غير مرفوعة"]
    },
    permissions: {
        type: [Number],
        required: [true, 'الصلاحيات مطلوبة'],
        enum: [28, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17, 12, 14, 15, 20, 21, 22, 23, 24, 29]
    },
    tech_admin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const Admins = mongoose.model('Admins', adminsSchema);
module.exports = Admins;
