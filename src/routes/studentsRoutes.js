const router = require("express").Router();

const { toDeleteStudent_get, addStudent_post, deleteStudent_get, fetchStudentByStudentId_get,editStudentByStudentId_post, fetchStudentsByTeacherId_get, deleteStudentByTeacher } = require("../controllers/studentsController")

router.post("/register", addStudent_post);
router.get("/delete/:id", deleteStudent_get);
router.get("/to-delete/:id", toDeleteStudent_get);

router.get("/:id", fetchStudentByStudentId_get);
router.get("/get-all/:id", fetchStudentsByTeacherId_get);

router.post("/edit/", editStudentByStudentId_post);
router.delete("/:teacherId/student/:studentId", deleteStudentByTeacher);

module.exports = router;