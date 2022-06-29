const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');
const userController = require('../controllers/userController');

router.get('/admin/alluser', auth, userController.getAllUser);
router.get("/profile/:id", userController.userProfileById);
router.patch("/profile/update/:id", userController.userProfileUpdate);
router.delete('/profile/delete/:id', userController.userProfileDelete);
router.post('/profile/emailCode', auth, userController.emailCode);
router.post('/profile/changePass', auth, userController.changepassword);

module.exports = router;