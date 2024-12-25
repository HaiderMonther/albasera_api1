const router = require("express").Router();
const multer = require('multer');

// controllers
const { teacher_login, admin_login } = require("../controllers/authController")
router.post("/teachers/login", teacher_login);

router.post("/admins/login", admin_login);


module.exports = router;