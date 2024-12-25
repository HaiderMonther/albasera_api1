const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guidesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    youtube_url: {
        type: String,
        required: true,
    },
    description: {
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

const Guides = mongoose.model('Guides', guidesSchema);
module.exports = Guides;