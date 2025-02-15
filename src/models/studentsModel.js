const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true,
        enum: ['اول ابتدائي', 'ثاني ابتدائي', 'ثالث ابتدائي', 'رابع ابتدائي', 'خامس ابتدائي', 'سادس ابتدائي', 'اول متوسط', 'ثاني متوسط', 'ثالث متوسط']
    },
    size: {
        type: String,
        required: true
    },
    to_delete: {
        type: Boolean,
        required: true
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['ذكر', 'انثى']
    },
    academic_level: {
        type: String,
        required: true,
        enum: ['أولى', 'ثانية', 'ثالثة']
    },

}, {
    timestamps: true
})


const Students = mongoose.model('Students', studentsSchema);
module.exports = Students;