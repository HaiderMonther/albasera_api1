const mongoose = require("mongoose");
const Governorate = require("../models/governoratesModel");
const Region = require("../models/regionsModel");
const Joi = require("joi");


const governorateSchemaValidator = Joi.object({
    governorate_name: Joi.string().required().messages({
        "string.empty": "Governorate name is required.",
        "any.required": "Governorate name must be provided.",
    }),
});

// إضافة محافظة جديدة
async function addGovernorate_post(req, res) {
    const { governorate_name, governorate_code, total_students_number, total_teachers_number } = req.body;

    // التحقق من القيم المطلوبة فقط
    if (!governorate_name || !governorate_code) {
        return res.status(400).json({ message: "Governorate name and code are required" });
    }

    try {
        const governorateObj = await Governorate.create({
            governorate_name,
            governorate_code,
        });
        return res.status(201).json(governorateObj);
    } catch (err) {
        console.error("Error adding governorate:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// جلب جميع المحافظات
async function getAllGovernorates_get(req, res) {
    try {
        const governoratesObj = await Governorate.find();
        return res.status(200).json(governoratesObj);
    } catch (err) {
        console.error("Error fetching governorates:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAllGovernoratesWithRegions_get(req, res) {
    try {
        const governoratesWithRegions = await Governorate.aggregate([
            {
                $lookup: {
                    from: "regions",
                    localField: "_id",
                    foreignField: "governorate_id",
                    as: "regions",
                },
            },
            {
                $addFields: {
                    region_id: { $arrayElemAt: ["$regions._id", 0] },
                },
            },
            {
                $project: {
                    regions: 0,
                },
            },
        ]);

        return res.status(200).json(governoratesWithRegions);
    } catch (err) {
        console.error("Error fetching governorates with regions:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    addGovernorate_post,
    getAllGovernorates_get,
    getAllGovernoratesWithRegions_get,
};
