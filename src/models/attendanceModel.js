const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true,
    },
    register_location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    register_date: {
        type: Date,
        required: true,
    },
    students_number: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: null,
    },
},
    {
        timestamps: true
    }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;