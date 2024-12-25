const Admins = require('../models/adminsModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // Add this line

// إنشاء مسؤول جديد
const addAdmin = async (req, res) => {
    const { username, password, full_name, personal_image, permissions } = req.body;

    // التحقق من صحة المدخلات
    if (!username || !password || !full_name || !permissions) {
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // التحقق من أن permissions هي مصفوفة
    if (!Array.isArray(permissions)) {
        return res.status(400).json({ message: "الصلاحيات يجب أن تكون مصفوفة من الأرقام" });
    }

    try {
        // التحقق من وجود المستخدم مسبقًا
        const existingAdmin = await Admins.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "اسم المستخدم مستخدم مسبقًا" });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        // إنشاء المسؤول الجديد
        const newAdmin = await Admins.create({
            username,
            password: hashedPassword,
            full_name,
            personal_image,
            permissions,

        });

        return res.status(201).json({ message: "تم إنشاء المسؤول بنجاح", admin: newAdmin });
    } catch (error) {
        console.error("Error adding admin:", error.message);
        return res.status(500).json({ message: "خطأ في الخادم الداخلي" });
    }
};

// دالة لجلب جميع الإداريين
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admins.find(); // جلب جميع الإداريين من قاعدة البيانات
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching admins", error });
    }
};

// حذف الإداري
const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        // Check if adminId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            console.log('Invalid adminId:', adminId); // Add this line
            return res.status(400).json({
                status: 'error',
                message: 'معرف الإداري غير صالح',
            });
        }

        const deletedAdmin = await Admins.findByIdAndDelete(adminId);
        console.log('Attempting to delete admin with id:', adminId);
        if (!deletedAdmin) {
            console.log('Admin not found with id:', adminId);
            return res.status(404).json({
                status: 'error',
                message: 'الإداري غير موجود',
            });
        }
        console.log('Admin deleted successfully:', deletedAdmin);
        return res.status(200).json({
            status: 'success',
            message: 'تم حذف الإداري بنجاح',
            data: deletedAdmin,
        });
    } catch (error) {
        console.error('Error deleting admin:', error.message);

        return res.status(500).json({
            status: 'error',
            message: 'خطأ في الخادم الداخلي',
            error: error.message,
        });
    }
};

module.exports = {
    addAdmin,
    getAllAdmins,
    deleteAdmin
};
