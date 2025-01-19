const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const governorateSchema = new Schema(
    {
        governorate_name: {
            type: String,
            required: [true, "Governorate name is required"],
        },
        governorate_code: {
            type: Number,
            required: [true, "Governorate code is required"],
            enum: {
                values:  [28, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17, 12, 14, 15, 20, 21, 22, 23, 24, 29],
                message: "{VALUE} is not a valid governorate code",
            },
        },
        total_students_number: {
            type: Number,
            default: null, 
        },
        total_teachers_number: {
            type: Number,
            default: null, 
        },
        registered_students: {
            type: Number,
            default: null,
        },
        registered_teachers: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Governorate = mongoose.model("Governorate", governorateSchema);

module.exports = Governorate;
