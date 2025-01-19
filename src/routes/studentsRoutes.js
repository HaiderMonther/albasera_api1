const router = require("express").Router();

const { toDeleteStudent_get, addStudent_post, deleteStudent_get, fetchStudentByStudentId_get, editStudentByStudentId_put, fetchStudentsByTeacherId_get, deleteStudentByTeacher } = require("../controllers/studentsController")

router.post("/register", addStudent_post);
router.delete("/delete/:id", deleteStudent_get);
router.get("/to-delete/:id", toDeleteStudent_get);

router.get("/:id", fetchStudentByStudentId_get);
router.get("/get-all/:teacher_id", fetchStudentsByTeacherId_get);

router.put("/edit/", editStudentByStudentId_put);
router.delete("/:teacherId/student/:studentId", deleteStudentByTeacher);

module.exports = router;