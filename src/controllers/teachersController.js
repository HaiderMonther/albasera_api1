const Teachers = require("../models/teachersModel");
const Governorate = require("../models/governoratesModel");
const Region = require("../models/regionsModel");

const { registerTeacherValidator } = require("../utils/validations/teacherValidators")
const fs = require("fs");
const path = require("path");
const myEmitter = require('../utils/eventEmitter');
const ExcelJS = require('exceljs');


async function registerTeacherPost(req, res) {
    const {
        teacher_id,
        region_id,
        governorate_id,
        full_name,
        birth_date,
        phone_number,
        work,
        mosque_name,
        degree,
        gender,
        previous_teacher,
        image_1,
        image_2,
        image_3
    } = req.body;


    // validate login data
    const result = registerTeacherValidator({
        teacher_id,
        region_id,
        governorate_id,
        full_name,
        birth_date,
        phone_number,
        work,
        gender,
        mosque_name,
        degree,
        previous_teacher
    })

    if (result.valid == false) {
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_1))
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_2))
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_3))
        return res.status(401).json({ message: result.msg })

    }


    try {
        const teacher = await Teachers.findByIdAndUpdate(teacher_id, {
            region_id,
            governorate_id,
            full_name,
            birth_date,
            phone_number,
            work,
            mosque_name,
            degree,
            state: 1,
            image_1,
            image_2,
            image_3,
            previous_teacher
        })

        myEmitter.emit("incrementTeachersForGovernorate", governorate_id)

        return res.status(200).json(teacher)
    } catch (error) {
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_1))
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_2))
        fs.unlinkSync(path.join(__dirname, "../../public/", req.body.image_3))
        console.log(error.message);
        return res.status(500).json({ message: error.message })
    }
}


async function getTeacherByGovernorate_get(req, res) {
    const { governorate_id } = req.params;
    if (!governorate_id) {
        return res.status(404).json({ message: 'governorate id is required' });
    }
    try {
        // Find teachers based on governorate_id
        const teachers = await Teachers.find({ governorate_id });

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for this governorate' });
        }

        // Respond with the list of teachers
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error while fetching teachers' });
    }
}




async function getTeachersByRegion_get(req, res) {
    const { region_id } = req.params;
    if (!region_id) {
        return res.status(404).json({ message: 'region id is required' });
    }
    try {
        // Find teachers based on region_id
        const teachers = await Teachers.find({ region_id });

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for this region' });
        }

        // Respond with the list of teachers
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error while fetching teachers' });
    }
};



async function getTeachersReportByGovernorate_get(req, res) {
    const { governorate_id } = req.params;
    if (!governorate_id) {
        return res.status(404).json({ message: 'Governorate ID is required' });
    }

    try {
        // Find teachers based on governorate_id
        const teachers = await Teachers.find({ governorate_id });

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for this governorate' });
        }

        const regionsObj = await Region.find();
        const governorate = await Governorate.findById(governorate_id);

        const teachersDataForReport = [];
        for (const teacher of teachers) {
            const teacher_name = teacher.full_name;
            const regionIndex = regionsObj.findIndex(record => record.id == teacher.region_id);
            const region_name = regionsObj[regionIndex] ? regionsObj[regionIndex].region_name : "N/A";
            const governorate_name = governorate.governorate_name;
            const username = teacher.username;
            const students_number = teacher.students_number;
            const phone_number = teacher.phone_number;
            const image_1 = teacher.image_1; // صورة شخصية
            const image_2 = teacher.image_2; // وجه الهوية
            const image_3 = teacher.image_3; // خلفية الهوية

            teachersDataForReport.push({
                teacher_name,
                region_name,
                governorate_name,
                username,
                students_number,
                phone_number,
                image_1,
                image_2,
                image_3
            });
        }

        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Teachers');

        // Add columns to the worksheet
        worksheet.columns = [
            { header: 'الاسم الكامل', key: 'teacher_name', width: 30 },
            { header: 'القضاء', key: 'region_name', width: 20 },
            { header: 'المحافظة', key: 'governorate_name', width: 20 },
            { header: 'اسم المستخدم', key: 'username', width: 20 },
            { header: 'عدد الطلاب', key: 'students_number', width: 15 },
            { header: 'رقم الهاتف', key: 'phone_number', width: 15 },
            { header: 'الصورة الشخصية', key: 'image_1', width: 20 },
            { header: 'وجه الهوية', key: 'image_2', width: 20 },     
            { header: 'خلفية الهوية', key: 'image_3', width: 20 }
        ];

        // Add rows to the worksheet
        teachersDataForReport.forEach((item, index) => {
            const row = worksheet.addRow({
                teacher_name: item.teacher_name,
                region_name: item.region_name,
                governorate_name: item.governorate_name,
                username: item.username,
                students_number: item.students_number,
                phone_number: item.phone_number
            });
            // Embed image_1 (الصورة الشخصية)
            if (item.image_1) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_1));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 6, row: index + 1 }, // Column G for image_1
                        ext: { width: 100, height: 100 }
                    });
                }
            }

            // Embed image_2 (وجه الهوية)
            if (item.image_2) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_2));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 7, row: index + 1 }, // Column H for image_2
                        ext: { width: 100, height: 100 }
                    });
                }
            }

            // Embed image_3 (خلفية الهوية)
            if (item.image_3) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_3));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 8, row: index + 1 }, // Column I for image_3
                        ext: { width: 100, height: 100 }
                    });
                }
            }
        });

        // Set headers for the response to download the file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=teachersData.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);

    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error while fetching teachers' });
    }
}


async function getTeachersReportByRegion_get(req, res) {
    const { governorate_id } = req.params;
    const { region_id } = req.params;
    if (!governorate_id) {
        return res.status(404).json({ message: 'Governorate ID is required' });
    }

    if (!region_id) {
        return res.status(404).json({ message: 'Region ID is required' });
    }

    try {
        // Find teachers based on governorate_id
        const teachers = await Teachers.find({ region_id });

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for this region' });
        }

        const region = await Region.findById(region_id);
        const governorate = await Governorate.findById(governorate_id);

        const teachersDataForReport = [];
        for (const teacher of teachers) {
            const teacher_name = teacher.full_name;
            const region_name = region.region_name;
            const governorate_name = governorate.governorate_name;
            const username = teacher.username;
            const students_number = teacher.students_number;
            const phone_number = teacher.phone_number;
            const image_1 = teacher.image_1; // صورة شخصية
            const image_2 = teacher.image_2; // وجه الهوية
            const image_3 = teacher.image_3; // خلفية الهوية

            teachersDataForReport.push({
                teacher_name,
                region_name,
                governorate_name,
                username,
                students_number,
                phone_number,
                image_1,
                image_2,
                image_3
            });
        }

        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Teachers');

        // Add columns to the worksheet
        worksheet.columns = [
            { header: 'الاسم الكامل', key: 'teacher_name', width: 30 },
            { header: 'القضاء', key: 'region_name', width: 20 },
            { header: 'المحافظة', key: 'governorate_name', width: 20 },
            { header: 'اسم المستخدم', key: 'username', width: 20 },
            { header: 'عدد الطلاب', key: 'students_number', width: 15 },
            { header: 'رقم الهاتف', key: 'phone_number', width: 15 },
            { header: 'الصورة الشخصية', key: 'image_1', width: 20 }, // Column for image_1
            { header: 'وجه الهوية', key: 'image_2', width: 20 },     // Column for image_2
            { header: 'خلفية الهوية', key: 'image_3', width: 20 }    // Column for image_3
        ];

        // Add rows to the worksheet
        teachersDataForReport.forEach((item, index) => {
            const row = worksheet.addRow({
                teacher_name: item.teacher_name,
                region_name: item.region_name,
                governorate_name: item.governorate_name,
                username: item.username,
                students_number: item.students_number,
                phone_number: item.phone_number
            });

            // Embed image_1 (الصورة الشخصية)
            if (item.image_1) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_1));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 6, row: index + 1 }, // Column G for image_1
                        ext: { width: 100, height: 100 }
                    });
                }
            }

            // Embed image_2 (وجه الهوية)
            if (item.image_2) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_2));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 7, row: index + 1 }, // Column H for image_2
                        ext: { width: 100, height: 100 }
                    });
                }
            }

            // Embed image_3 (خلفية الهوية)
            if (item.image_3) {
                const imagePath = path.resolve(path.join(__dirname, "../../public", item.image_3));
                if (fs.existsSync(imagePath)) {
                    const imageId = workbook.addImage({
                        filename: imagePath,
                        extension: 'jpeg'
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 8, row: index + 1 }, // Column I for image_3
                        ext: { width: 100, height: 100 }
                    });
                }
            }
        });



        // Set headers for the response to download the file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=teachersData.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);

    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error while fetching teachers' });
    }
};

async function getPendingTeachers(req, res) {
    const { governorate_id } = req.params;
    if (!governorate_id) {
        return res.status(404).json({ message: 'governorate  id is required' });
    }
    try {
        // Find teachers based on region_id
        const teachers = await Teachers.find({
            governorate_id: governorate_id, // Replace with your variable or value
            state: 1
        });

        if (!teachers || teachers.length === 0) {
            return res.status(404).json({ message: 'No teachers found for this region' });
        }

        // Respond with the list of teachers
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error while fetching teachers' });
    }
}
const approveTeacher = async (req, res) => {
    const teacherId = req.params.id;

    try {
        const teacher = await Teachers.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (teacher.state !== 1) {
            return res.status(400).json({ message: "Teacher is not in pending status" });
        }

        teacher.state = 2;
        await teacher.save();
        res.status(200).json({ message: "Teacher approved successfully", teacher });
    } catch (error) {
        res.status(500).json({ message: "Error approving teacher", error });
    }
};

const rejectTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { reason } = req.body;
        const teacher = await Teachers.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        console.log(teacher);
        if (teacher.state !== 1) {
            return res.status(400).json({ message: "Teacher is not in pending status" });
        }
        teacher.state = 3; // تحديث الحالة إلى مرفوض
        teacher.rejectionReason = reason || "No reason provided"; // تعيين سبب الرفض
        await teacher.save();

        res.status(200).json({ message: "Teacher rejected successfully", teacher });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting teacher", error });
    }
};



module.exports = {
    registerTeacherPost,
    getTeacherByGovernorate_get,
    getTeachersByRegion_get,
    getTeachersReportByRegion_get,
    getTeachersReportByGovernorate_get,
    getPendingTeachers,
    approveTeacher,
    rejectTeacher
}