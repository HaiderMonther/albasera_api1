const adminsModel = require("../models/adminsModel");
const teachersModel = require("../models/teachersModel");
const bcrypt = require('bcrypt');

// validation functions
const { loginAdminValidator } = require("../utils/validations/adminValidators")
const { loginTeacherValidator } = require("../utils/validations/teacherValidators")

// auth services
const { assignJwt } = require("../services/authService")

async function admin_login(req, res) {
    const { username, password } = req.body;
    // validate login data
    const result = loginAdminValidator({ username, password })
    if (result.valid == false) {
        return res.status(401).json({ message: result.msg })
    }

    try {
        const admin = await adminsModel.findOne({ username: username });
        
        if (admin) {
            
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                const adminObj = {
                    id: admin._id,
                    permission: admin.permissions,
                    full_name: admin.full_name,
                    personal_image: admin.personal_image,
                    tech_admin: admin.tech_admin
                }
                const token = assignJwt(adminObj)
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({ token })
            }
        }
        return res.status(401).json({ message: "هنالك خطأ في اسم المستخدم او كلمة المرور" })
    } catch (error) {
        res.status(500).json({ message: "يرجى المحاولة لاحقا" })
    }
}


async function teacher_login(req, res) {

    const { username, password } = req.body;

    // validate login data
    const result = loginTeacherValidator({ username, password })
    if (result.valid == false) {
        return res.status(401).json({ message: result.msg })
    }

    try {
        const teacher = await teachersModel.findOne({ username: username });
        if (teacher) {
            const isMatch = await bcrypt.compare(password, teacher.password);
            if (isMatch) {
                return res.status(200).json({
                    id: teacher._id,
                    state: teacher.state,
                    message: "",
                    data : teacher
                })
            }
        }
        return res.status(401).json({ message: "هنالك خطأ في اسم المستخدم او كلمة المرور" })
    } catch (error) {
        res.status(500).json({ message: "يرجى المحاولة لاحقا" })
    }
}


module.exports = {
    admin_login,
    teacher_login
}
