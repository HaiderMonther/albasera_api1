const mongoose = require("mongoose");
const { Schema } = mongoose;

const teachersSchema = new Schema({
    region_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
        default: null
    },
    governorate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Governorate',
        required: true,
        default: null
    },
    username: {
        type: String,
        required: [true, 'اسم المستخدم مطلوب'],
        unique: [true, 'اسم المستخدم هذا مكرر'],
    },
    password: {
        type: Number,
        required: [true, 'كلمة المرور مطلوبة'],
        length: [6, "كلمة المرور غير مقبولة"]
    },
    state: {
        type: Number,
        default: 0
    },
    rejectionReason: {
        type: String,
        default: null,
    },
    full_name: {
        type: String,
        default: null
    },
    birth_date: {
        type: String,
        default: null
    },
    phone_number: {
        type: String,
        default: null
    },
    students_number: {
        type: Number,
        default: null
    },
    mosque_name: {
        type: String,
        default: null
    },
    degree: {
        type: String,
        default: null
    },
    work: {
        type: String,
        default: null
    },
    previous_teacher: {
        type: Boolean,
        default: null
    },
    image_1: {
        type: String,
        default: null
    },
    image_2: {
        type: String,
        default: null
    },
    image_3: {
        type: String,
        default: null
    },
    update: {
        type: Boolean,
        default: null
    },
    gender: {
        type: String,
        default: null,
        enum: ['انثى', 'ذكر']
    }
},
    {
        timestamps: true
    }
);

const Teachers = mongoose.model('Teachers', teachersSchema);
module.exports = Teachers;