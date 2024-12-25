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
        required: true
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
    }
}, {
    timestamps: true
})


const Students = mongoose.model('Students', studentsSchema);
module.exports = Students;