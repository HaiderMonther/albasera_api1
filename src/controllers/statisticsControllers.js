const Governorate = require("../models/governoratesModel");


async function fetchLatestStudentsStatistics_get(req, res) {
    try {
        const adminPermissions = req.admin.permissions;

        // 2. Find governorates that admin has access to (Governorate table)
        const accessibleGovernorates = await Governorate.find({
            governorate_code: { $in: adminPermissions }
        });

        let total_students_number = 0;
        for (const governorate of accessibleGovernorates) {
            total_students_number += governorate.total_students_number
        }

        let registered_students = 0;
        for (const governorate of accessibleGovernorates) {
            registered_students += governorate.registered_students
        }

        return res.status(200).json({
            total_students_number: total_students_number,
            registered_students: registered_students,
            governorates: accessibleGovernorates
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function fetchLatestTeachersStatistics_get(req, res) {
    try {
        const adminPermissions = req.admin.permissions;
        console.log("Admin Permissions:", adminPermissions);
        // 2. Find governorates that admin has access to (Governorate table)
        const accessibleGovernorates = await Governorate.find({
            governorate_code: { $in: adminPermissions }
        });

        let total_teachers_number = 0;
        for (const governorate of accessibleGovernorates) {
            total_teachers_number += governorate.total_teachers_number
        }

        let registered_teachers = 0;
        for (const governorate of accessibleGovernorates) {
            registered_teachers += governorate.registered_teachers
        }

        return res.status(200).json({
            total_teachers_number: total_teachers_number,
            registered_teachers: registered_teachers,
            governorates: accessibleGovernorates
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    fetchLatestStudentsStatistics_get,
    fetchLatestTeachersStatistics_get
}
