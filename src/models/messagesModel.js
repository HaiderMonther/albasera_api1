const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    governorate_id: {
        type: mongoose.Schema.Types.Mixed, // Allows multiple types
        required: true,
        validate: {
            validator: function(value) {
                // Accepts either a valid ObjectId or the value 0
                return mongoose.Types.ObjectId.isValid(value) || value === "0";
            },
            message: 'governorate_id must be a valid ObjectId or 0'
        },
        ref: 'Governorate'
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;

