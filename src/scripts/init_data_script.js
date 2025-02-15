const Teachers = require("../models/teachersModel")
const Governorate = require("../models/governoratesModel")
const Regions = require("../models/regionsModel")
const Students = require("../models/studentsModel")
const Attendance = require("../models/attendanceModel")
const fs = require("fs");
const path = require("path");
const casual = require('casual');
const mongoose = require("mongoose");
const myEmitter = require('../utils/eventEmitter');


function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Event listener for updating students count for teachers
myEmitter.on("decrementStudentsForTeachers", async (teacher_id) => {
    await Teachers.findByIdAndUpdate(teacher_id, {
        $inc: { students_number: -1 },
    });
});

myEmitter.on("incrementStudentsForTeachers", async (teacher_id) => {
    await Teachers.findByIdAndUpdate(teacher_id, {
        $inc: { students_number: 1 },
    });
});


const governorateSavedData = [
    {
        governorate_name: 'النجف الأشرف',
        governorate_code: 30,
        total_students_number: 8730,
        total_teachers_number: 281,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'ميسان',
        governorate_code: 13,
        total_students_number: 4443,
        total_teachers_number: 162,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'بغداد',
        governorate_code: 11,
        total_students_number: 3591,
        total_teachers_number: 256,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'ذي قار',
        governorate_code: 27,
        total_students_number: 2450,
        total_teachers_number: 85,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'كربلاء المقدسة',
        governorate_code: 19,
        total_students_number: 6200,
        total_teachers_number: 251,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'صلاح الدين',
        governorate_code: 26,
        total_students_number: 5491,
        total_teachers_number: 129,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'واسط',
        governorate_code: 31,
        total_students_number: 7488,
        total_teachers_number: 236,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'الديوانية',
        governorate_code: 16,
        total_students_number: 6200,
        total_teachers_number: 158,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'كركوك',
        governorate_code: 25,
        total_students_number: 2855,
        total_teachers_number: 92,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'بابل',
        governorate_code: 18,
        total_students_number: 9216,
        total_teachers_number: 278,
        registered_students: 0,
        registered_teachers: 0
    },
    {
        governorate_name: 'المثنى',
        governorate_code: 17,
        total_students_number: 2035,
        total_teachers_number: 88,
        registered_students: 0,
        registered_teachers: 0
    }
]

const regionSavedData = [
    {
        region_name: "المدينة القديمة",
        governorate_code: 30,
    },
    {
        region_name: "الكوفة",
        governorate_code: 30,
    },
    {
        region_name: "المدائن",
        governorate_code: 11,
    },
    {
        region_name: "المنصور",
        governorate_code: 11,
    },
    {
        region_name: "قضاء المركز",
        governorate_code: 19,
    },
    {
        region_name: "الحر",
        governorate_code: 19,
    },
    {
        region_name: "الكوت",
        governorate_code: 31,
    },
    {
        region_name: "العزيزية",
        governorate_code: 31,
    },
    {
        region_name: "بلد",
        governorate_code: 26,
    },
    {
        region_name: "سامراء",
        governorate_code: 26,
    },
    {
        region_name: "الاصلاح",
        governorate_code: 27,
    },
    {
        region_name: "الدواية",
        governorate_code: 27,
    },
    {
        region_name: "المجر",
        governorate_code: 13,
    },
    {
        region_name: "العمارة",
        governorate_code: 13,
    },
    {
        region_name: "ام الخيل",
        governorate_code: 16,
    },
    {
        region_name: "العروبة",
        governorate_code: 16,
    },
    {
        region_name: "كركوك",
        governorate_code: 25,
    },
    {
        region_name: "داقوق",
        governorate_code: 25,
    },
    {
        region_name: "المسيب",
        governorate_code: 18,
    },
    {
        region_name: "الحلة",
        governorate_code: 18,
    },
    {
        region_name: "الخضر",
        governorate_code: 17,
    },
    {
        region_name: "الرميثة",
        governorate_code: 17,
    }
]

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/albasira_app");
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

const setGovernorateAndRegions = async () => {

    const governorateSavedInDb = await Governorate.create(governorateSavedData);

    for (const region of regionSavedData) {
        for (const governorate of governorateSavedInDb) {
            if (region.governorate_code == governorate.governorate_code) {
                region['governorate_id'] = governorate.id;
            }
        }
    }

    await Regions.create(regionSavedData)
}

const setTeachersData = async () => {
    try {
        const governorates = await Governorate.find();
        const regions = await Regions.find();

        const teachersData = [];

        for (const region of regions) {
            let TeachersNumberPerRegion = getRandomNumberInRange(10, 20);
            for (let i = 0; i < TeachersNumberPerRegion; i++) {
                // Ensure both IDs are compared as strings
                const governorate = governorates.find(
                    (gov) => gov._id.toString() === region.governorate_id.toString()
                );

                if (!governorate) {
                    console.error(`No governorate found for region ${region.region_name}`);
                    continue; // Skip this iteration if no governorate is found
                }

                await Governorate.findByIdAndUpdate(governorate._id, {
                    $inc: { registered_teachers: 1 }
                });

                // Generate a teacher record for the region
                const teacher = {
                    region_id: region._id,
                    governorate_id: governorate._id,
                    username: casual.username,
                    password: casual.integer(100000, 999999), // Random 6-digit password
                    state: casual.integer(0, 1),
                    full_name: casual.full_name,
                    birth_date: casual.date("YYYY-MM-DD"),
                    phone_number: casual.phone,
                    students_number: 0,
                    mosque_name: casual.company_name,
                    degree: casual.random_element(["Bachelor", "Master", "PhD"]),
                    work: casual.random_element(["Engineer", "Doctor", "Teacher", "Worker"]),
                    previous_teacher: casual.boolean,
                    image_1: casual.url,
                    image_2: casual.url,
                    image_3: casual.url,
                    update: casual.boolean,
                    gender: casual.random_element(["انثى", "ذكر"]),
                };

                teachersData.push(teacher);
            }
        }

        await Teachers.insertMany(teachersData);
        console.log(`${teachersData.length}teacher records added successfully`);
    } catch (error) {
        console.error("Error inserting teacher records:", error);
    }
};


const setStudentsData = async () => {
    try {
        const teachers = await Teachers.find();

        const studentsData = [];

        for (const teacher of teachers) {
            let StudentsNumberPerTeacher = getRandomNumberInRange(20, 30);

            for (let i = 0; i < StudentsNumberPerTeacher; i++) {
                const student = {
                    name: casual.full_name,
                    age: casual.integer(5, 15), // Assuming age range for students
                    phone_number: casual.phone,
                    degree: casual.random_element(["A", "B", "C", "D"]),
                    size: casual.random_element(["Small", "Medium", "Large"]),
                    to_delete: casual.boolean,
                    teacher_id: teacher._id,
                    gender: casual.random_element(["انثى", "ذكر"]),
                };

                await Governorate.findByIdAndUpdate(teacher.governorate_id, {
                    $inc: { registered_students: 1 }
                });

                studentsData.push(student);
                myEmitter.emit("incrementStudentsForTeachers", teacher._id);
            }
        }

        await Students.insertMany(studentsData);
        console.log(`${studentsData.length} student records added successfully`);
    } catch (error) {
        console.error("Error inserting student records:", error);
    }
};


const setAttendanceRecords = async () => {
    try {

        const teachers = await Teachers.find();
        const attendanceData = [];
        const daysAhead = 6; // Number of future days

        teachers.forEach((teacher) => {
            for (let day = 0; day <= daysAhead; day++) {
                const registerDate = new Date();
                registerDate.setDate(registerDate.getDate() + day);

                const attendanceRecord = {
                    teacher_id: teacher._id,
                    register_location: {
                        lat: casual.latitude,
                        lng: casual.longitude,
                    },
                    register_date: registerDate,
                    students_number: casual.integer(20, 40), // Random number of students
                    image: casual.url,
                    message: casual.sentence,
                };

                attendanceData.push(attendanceRecord);
            }
        });

        await Attendance.insertMany(attendanceData);
        console.log(`Attendance records for the next ${daysAhead} days added successfully.`);
    } catch (error) {
        console.error("Error creating attendance records:", error);
    } finally {
        mongoose.disconnect();
    }
};

(async () => {
    try {
        connectDB()

        await Governorate.deleteMany();
        await Regions.deleteMany();
        await Teachers.deleteMany();
        await Students.deleteMany();
        await Attendance.deleteMany();


        await setGovernorateAndRegions()
        await setTeachersData()
        await setStudentsData()
        await setAttendanceRecords()
        process.exit(0)

    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
})()