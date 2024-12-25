const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lecturesSchema = new Schema({
    week_order: {
        type: Number,
        required: true,
    },
    youtube_url: {
        type: String,
        required: true,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins',
        required: true,
    },
},
    {
        timestamps: true
    }
);

const Lectures = mongoose.model('Lectures', lecturesSchema);
module.exports = Lectures;