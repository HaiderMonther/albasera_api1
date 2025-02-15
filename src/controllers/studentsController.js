const Students = require("../models/studentsModel");
const { addStudentValidator, editStudentValidator } = require("../utils/validations/studentsValidators");
const myEmitter = require('../utils/eventEmitter');
const Teachers = require("../models/teachersModel");
const Governorate = require("../models/governoratesModel");

async function addStudent_post(req, res) {
    const studentData = req.body;
    console.log("studentData", studentData);

    // Validate student data
    const result = addStudentValidator(studentData);
    console.log("studentData", result);

    if (!result.valid) {
        return res.status(401).json({ message: result.msg });
    }

    studentData.to_delete = false;

    try {
        // Create the student
        const student = await Students.create(studentData);

        // get governorate id
        const teacher = await Teachers.findById(studentData.teacher_id);
        myEmitter.emit("incrementStudentsForGovernorate", teacher.governorate_id)
        myEmitter.emit("incrementStudentsForTeachers", studentData.teacher_id)
        return res.status(200).json(student)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteStudent_get(req, res) {
    const studentId = req.params.id;
    if (studentId == "" || !studentId) {
        return res.status(404).json({ message: 'studentId did not send' });
    }

    try {
        const student = await Students.findById(studentId);
        if (student) {
            const teacher_id = student.teacher_id;
            await Students.findByIdAndDelete(studentId);
            // get governorate id
            const teacher = await Teachers.findById(teacher_id);
            myEmitter.emit("decrementStudentsForGovernorate", teacher.governorate_id)
            myEmitter.emit("decrementStudentsForTeachers", teacher_id)


        }
        return res.status(200).json({})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

async function toDeleteStudent_get(req, res) {
    const studentId = req.params.id;
    if (studentId == "" || !studentId) {
        return res.status(404).json({ message: 'studentId did not send' });
    }
    try {
        const student = await Students.findById(studentId);
        if (student) {
            await Students.findByIdAndUpdate(studentId, { to_delete: true });
            return res.status(201).json({})
        }
        return res.status(404).json({ message: "Student not found" })
    } catch (error) {
        return res.status(500).json({ message: "Wrong student id" })
    }
}

async function fetchStudentByStudentId_get(req, res) {
    const studentId = req.params.id;
    if (studentId == "" || !studentId) {
        return res.status(404).json({ message: 'studentId did not send' });
    }

    try {
        const student = await Students.findById(studentId);
        if (student)
            return res.status(200).json(student)

        return res.status(404).json({ message: "Student not found" })
    } catch (error) {
        return res.status(500).json({ message: "Wrong student id" })
    }

}

async function fetchStudentsByTeacherId_get(req, res) {
    const teacherId = req.params.teacher_id;
    console.log(teacherId);

    if (teacherId == "" || !teacherId) {
        return res.status(404).json({ message: 'teacherId did not send' });
    }

    try {
        const students = await Students.find({ teacher_id: teacherId });
        return res.status(200).json(students)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Wrong teacher id" })
    }

}

async function editStudentByStudentId_put(req, res) {
    const studentId = req.body.id;
    if (studentId == "" || !studentId) {
        return res.status(404).json({ message: 'studentId did not send' });
    }

    const {
        name,
        age,
        phone_number,
        degree,
        size,
        gender
    } = req.body;

    if (!gender) {
        return res.status(401).json({ message: 'gender must be provided.' });
    }

    const result = editStudentValidator({
        name,
        age,
        phone_number,
        degree,
        size,
        gender
    })

    if (result.valid == false) {
        return res.status(401).json({ message: result.msg })
    }

    try {
        const student = await Students.findByIdAndUpdate(studentId, {
            name,
            age,
            phone_number,
            degree,
            size,
            gender
        });

        return res.status(200).json({})

    } catch (error) {
        return res.status(500).json({ message: "Wrong student id" })
    }

}

async function deleteStudentByTeacher(req, res) {
    try {
        const { teacherId, studentId } = req.params;


        if (!teacherId || !studentId) {
            return res.status(400).json({ message: "Both teacherId and studentId are required" });
        }

        const student = await Students.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "الطالب غير موجود" });
        }

        if (student.teacher_id.toString() !== teacherId) {
            return res.status(403).json({ message: "You are not authorized to delete this student" });
        }

        await Students.findByIdAndDelete(studentId);

        const teacher = await Teachers.findById(teacherId);
        if (teacher) {
            myEmitter.emit("decrementStudentsForGovernorate", teacher.governorate_id);
            myEmitter.emit("decrementStudentsForTeachers", teacherId);
        }

        return res.status(200).json({ message: "تم حذف الطالب بنجاح" });
    } catch (error) {
        console.error("Error deleting student:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



module.exports = {
    addStudent_post,
    deleteStudent_get,
    fetchStudentByStudentId_get,
    fetchStudentsByTeacherId_get,
    editStudentByStudentId_put,
    toDeleteStudent_get,
    deleteStudentByTeacher
}