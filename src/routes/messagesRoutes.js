const router = require("express").Router();

const {fetchAllMessages_get,sendMessage_post, fetchMessagesForTeacher_get} = require("../controllers/messagesControllers")

router.get("/get", fetchAllMessages_get);
router.get("/governorate/:id", fetchMessagesForTeacher_get);

router.post("/send/", sendMessage_post);



module.exports = router;