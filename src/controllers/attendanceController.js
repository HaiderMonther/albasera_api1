const Attendance = require("../models/attendanceModel");
const Teachers = require("../models/teachersModel");
const Regions = require("../models/regionsModel");
const Governorate = require("../models/governoratesModel");
const calculateAbsenceRate = require("../utils/functions/calculateAbsenceRate");
const { sendAttendanceValidator } = require("../utils/validations/attendanceValidators");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

async function saveNewAttendance_post(req, res) {
    let { teacher_id, register_location, register_date, students_number, image, message } = req.body;

    if (!message || message.length === 0) {
        message = " ";
    }
    // Validate attendance data
    const result = sendAttendanceValidator({ teacher_id, register_location, register_date, students_number, message });
    if (result.valid === false) {
        if (fs.existsSync(path.join(__dirname, "../../public/", req.body.image))) {
            fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image));
        }
        return res.status(400).json({ message: result.msg });
    }

    try {
        // Validate and parse date
        if (isNaN(new Date(register_date))) {
            return res.status(400).json({ message: "Invalid register_date format" });
        }

        // Parse register_location
        try {
            register_location = JSON.parse(register_location);
        } catch (error) {
            return res.status(400).json({ message: "Invalid register_location format" });
        }

        const startDayTimestamp = new Date(register_date);
        startDayTimestamp.setUTCHours(0, 0, 0, 0);

        const endDayTimestamp = new Date(register_date);
        endDayTimestamp.setUTCHours(23, 59, 59, 999);

        // Delete existing records
        await Attendance.deleteMany({
            teacher_id,
            register_date: { $gte: startDayTimestamp, $lte: endDayTimestamp },
        });

        // Create new attendance record
        const newAttendance = await Attendance.create({
            teacher_id,
            register_location,
            register_date: new Date(register_date),
            students_number,
            image,
            message,
        });

        return res.status(201).json(newAttendance);
    } catch (error) {
        console.error("Error saving attendance:", error.message);
        if (fs.existsSync(path.join(__dirname, "../../public/", req.body.image))) {
            fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image));
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
////////////////
async function getAllAttendanceByTeacherId_get(req, res) {
    const teacherId = req.params.id;

    if (!teacherId) {
        return res.status(400).json({ message: "Teacher ID is required" });
    }

    try {
        const attendances = await Attendance.find({ teacher_id: teacherId });

        if (!attendances || attendances.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        return res.status(200).json(attendances);
    } catch (error) {
        console.error("Error fetching attendance by teacher ID:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getReportForAttendanceByGovernorate_post(req, res) {
    try {
        const { governorate_id, date } = req.body;

        if (!governorate_id) {
            return res.status(400).json({ message: "Governorate ID is required" });
        }

        const teachers = await Teachers.find({ governorate_id });
        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found for this governorate" });
        }

        const teacherIds = teachers.map(teacher => teacher._id);

        const currentDate = new Date(date || new Date());
        const startTimestamp = new Date(currentDate.setHours(0, 0, 0, 0));
        const endTimestamp = new Date(currentDate.setHours(23, 59, 59, 999));

        const attendanceRecords = await Attendance.find({
            teacher_id: { $in: teacherIds },
            register_date: { $gte: startTimestamp, $lte: endTimestamp },
        });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this governorate" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance by governorate ID:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAllAttendanceByRegionId_post(req, res) {
    try {
        const { region_id, date } = req.body;

        if (!region_id) {
            return res.status(400).json({ message: "Region ID is required" });
        }

        const teachers = await Teachers.find({ region_id });
        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: "No teachers found for this region" });
        }

        const teacherIds = teachers.map(teacher => teacher._id);

        const currentDate = new Date(date || new Date());
        const startTimestamp = new Date(currentDate.setHours(0, 0, 0, 0));
        const endTimestamp = new Date(currentDate.setHours(23, 59, 59, 999));

        const attendanceRecords = await Attendance.find({
            teacher_id: { $in: teacherIds },
            register_date: { $gte: startTimestamp, $lte: endTimestamp },
        })
            .populate({
                path: 'teacher_id',
                select: 'full_name mosque_name region_id  students_number',
                populate: {
                    path: 'region_id',
                    select: 'region_name',
                },
            });
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this region" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance by region ID:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getReportForAttendanceByRegionId_post(req, res) {
    try {
        const { region_id, governorate_id, date } = req.body;

        if (!region_id || !governorate_id) {
            return res.status(400).json({ message: "Region ID and Governorate ID are required" });
        }

        const currentDate = new Date(date || new Date());
        const startTimestamp = new Date(currentDate.setHours(0, 0, 0, 0));
        const endTimestamp = new Date(currentDate.setHours(23, 59, 59, 999));

        const region = await Regions.findById(region_id);
        const governorate = await Governorate.findById(governorate_id);

        if (!region || !governorate) {
            return res.status(404).json({ message: "Region or Governorate not found" });
        }

        const teachers = await Teachers.find({ region_id });
        const teacherIds = teachers.map(teacher => teacher._id);

        const attendanceRecords = await Attendance.find({
            teacher_id: { $in: teacherIds },
            register_date: { $gte: startTimestamp, $lte: endTimestamp },
        });

        const reportData = teachers.map(teacher => {
            const attendanceRecord = attendanceRecords.find(record => record.teacher_id.equals(teacher._id));
            const attend_students_number = attendanceRecord ? attendanceRecord.students_number : 0;
            const absence_rate = attendanceRecord ? calculateAbsenceRate(teacher.students_number, attend_students_number) : "N/A";

            return {
                region_name: region.region_name,
                governorate_name: governorate.governorate_name,
                teacher_name: teacher.full_name,
                mosque_name: teacher.mosque_name,
                students_number: teacher.students_number,
                attend_students_number,
                absence_rate,
                report_out_date: new Date().toLocaleDateString(),
            };
        });

        // Create a new workbook and add data
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Attendance Report");

        worksheet.columns = [
            { header: "Region Name", key: "region_name", width: 30 },
            { header: "Governorate Name", key: "governorate_name", width: 30 },
            { header: "Teacher Name", key: "teacher_name", width: 30 },
            { header: "Mosque Name", key: "mosque_name", width: 30 },
            { header: "Students Number", key: "students_number", width: 20 },
            { header: "Attend Students Number", key: "attend_students_number", width: 25 },
            { header: "Absence Rate", key: "absence_rate", width: 15 },
            { header: "Report Date", key: "report_out_date", width: 20 },
        ];

        reportData.forEach(item => worksheet.addRow(item));

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=attendance_report.xlsx");

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.error("Error generating attendance report:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    saveNewAttendance_post,
    getAllAttendanceByTeacherId_get,
    getReportForAttendanceByGovernorate_post,
    getAllAttendanceByRegionId_post,
    getReportForAttendanceByRegionId_post,
};
