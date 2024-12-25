const express = require('express');
const { addAdmin, getAllAdmins, deleteAdmin } = require('../controllers/adminsController');
const { validateAndDeleteAdminImage } = require('../services/multerServiceForAdmin');
const router = express.Router();

router.post('/add', validateAndDeleteAdminImage, addAdmin);
router.get("/admins", getAllAdmins);
router.delete('/:id', deleteAdmin);

module.exports = router;
