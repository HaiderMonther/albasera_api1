const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regionSchema = new Schema({
    governorate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Governorate',
        required: true,
    },
    region_name: {
        type: String,
        required: true,
    },
    governorate_code: {
        type: Number,
        required: true,
        enum:  [28, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17, 12, 14, 15, 20, 21, 22, 23, 24, 29]
    },
},
    {
        timestamps: true
    });
const Region = mongoose.model("Region", regionSchema);
module.exports = Region;
