const Regions = require("../models/regionsModel");

async function addRegion_post(req, res) {
    const governorateCodes = [30, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17];

    const {
        region_name,
        governorate_id,
        governorate_code
    } = req.body;

    if (!region_name) {
        return res.status(400).json({ message: 'Region name is required' });
    }

    if (!governorate_id) {
        return res.status(400).json({ message: 'Governorate ID is required' });
    }

    if (!governorateCodes.includes(governorate_code)) {
        return res.status(400).json({ message: 'Invalid governorate code' });
    }

    try {
        const regionObj = await Regions.create({
            region_name,
            governorate_id,
            governorate_code
        });

        return res.status(201).json(regionObj); // 201 for created resource

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to create region" });
    }
}

async function editRegion_post(req, res) {
    const { region_id, region_name, governorate_id, governorate_code } = req.body;
    const governorateCodes = [30, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17];

    if (!region_id) {
        return res.status(400).json({ message: 'Region ID is required' });
    }

    if (!region_name) {
        return res.status(400).json({ message: 'Region name is required' });
    }

    if (!governorate_id) {
        return res.status(400).json({ message: 'Governorate ID is required' });
    }

    if (!governorateCodes.includes(governorate_code)) {
        return res.status(400).json({ message: 'Invalid governorate code' });
    }

    try {
        const regionObj = await Regions.findByIdAndUpdate(region_id, {
            region_name,
            governorate_id,
            governorate_code
        }, { new: true });

        if (!regionObj) {
            return res.status(404).json({ message: 'Region not found' });
        }

        return res.status(200).json(regionObj);

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to update region" });
    }
}

async function getRegionsForGovernorate_get(req, res) {
    const governorate_id = req.params.id;

    if (!governorate_id) {
        return res.status(400).json({ message: 'Governorate ID is required' });
    }

    try {
        const regionsObj = await Regions.find({
            governorate_id: governorate_id
        });

        if (!regionsObj || regionsObj.length === 0) {
            return res.status(404).json({ message: 'No regions found for the specified governorate' });
        }

        return res.status(200).json(regionsObj);

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch regions" });
    }
}

async function getAllRegions(req, res) {
    try {
        const regionsObj = await Regions.find();

        return res.status(200).json(regionsObj);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch regions" });
    }
}

module.exports = {
    addRegion_post,
    editRegion_post,
    getRegionsForGovernorate_get,
    getAllRegions
};
