const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datesSchema = new Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teachers',
        required: true,
    },
    lecture_date: {
        type: Date,
        required: true,
    },
    lecture_time: {
        type: String,
        require: true
    },
    lecture_day: {
        type: String,
        require: true
    }
},
    {
        timestamps: true
    }
);

const Dates = mongoose.model('Dates', datesSchema);
module.exports = Dates;