require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer")
const swaggerUI = require("swagger-ui-express")
const YAML = require('yamljs');
const path = require("path");
const fs = require("fs");
const myEmitter = require('./utils/eventEmitter');
const Governorate = require("./models/governoratesModel");
const Teachers = require("./models/teachersModel")


const { authenticateJwt } = require("./middlewares/authMiddlewares")
const app = express();

// const corsOptions = {
//     origin: [
//         `${process.env.ANDROID_APP_DOMAIN}`,
//         `${process.env.IOS_APP_DOMAIN}`
//     ],
//     methods: ['GET'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors());
const swaggerDocument = YAML.load(path.join(__dirname, "./configs/swagger.yaml"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))


// authentication routes
const authRoutes = require("./routes/authRoutes")
app.use("/auth", authRoutes)

const adminRoutes = require("./routes/adminRoutes")
app.use('/admins', adminRoutes);


const teacherRoutes = require("./routes/teacherRoutes")
app.use("/teachers", teacherRoutes)

const attendanceRoutes = require("./routes/attendanceRoutes")
app.use("/attendance", attendanceRoutes);

const studentsRoutes = require("./routes/studentsRoutes")
app.use("/students", studentsRoutes);

const regionsRoutes = require("./routes/regionsRoutes")
app.use("/regions", regionsRoutes);

const governoratesRoutes = require("./routes/governoratesRoutes")
app.use("/governorates", governoratesRoutes);

const messagesRoutes = require("./routes/messagesRoutes")
app.use("/messages", messagesRoutes);

const guidesRoutes = require("./routes/guidesRoutes")
app.use("/guides", guidesRoutes);

const lecturesRoutes = require("./routes/lecturesRoutes")
app.use("/lectures", lecturesRoutes);

const statisticsRoutes = require("./routes/statisticsRoutes")
app.use("/statistics", authenticateJwt, statisticsRoutes);

app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(401).json({ message: 'حجم الصور المرفوعة كبير جدا يرجى تخفيض الحجم لأقل من 10MB لكل صورة' });
        }
    } else if (err) {
        res.status(500).json({ message: 'حدث خطأ غير متوقع يرجى المحاولة لاحقاً' });
    };
});





// Event listener for updating registered teachers
myEmitter.on('decrementTeachersForGovernorate', async (governorate_id) => {
    await Governorate.findByIdAndUpdate(governorate_id, {
        $inc: { registered_teachers: -1 }
    });
});

// Event listener for updating registered teachers
myEmitter.on('incrementTeachersForGovernorate', async (governorate_id ) => {
    await Governorate.findByIdAndUpdate(governorate_id, {
        $inc: { registered_teachers: 1 }
    });
});

// Event listener for updating registered teachers
myEmitter.on('decrementStudentsForGovernorate', async (governorate_id) => {
    await Governorate.findByIdAndUpdate(governorate_id, {
        $inc: { registered_students: -1 }
    });
});

// Event listener for updating registered teachers
myEmitter.on('incrementStudentsForGovernorate', async (governorate_id) => {
    await Governorate.findByIdAndUpdate(governorate_id, {
        $inc: { registered_students: 1 }
    });
});


// Event listener for updating registered teachers
myEmitter.on('decrementStudentsForTeachers', async (teacher_id) => {
    await Teachers.findByIdAndUpdate(teacher_id, {
        $inc: { students_number: -1 }
    });
});

// Event listener for updating registered teachers
myEmitter.on('incrementStudentsForTeachers', async (teacher_id) => {
    await Teachers.findByIdAndUpdate(teacher_id, {
        $inc: { students_number: 1 }
    });
});


module.exports = app;