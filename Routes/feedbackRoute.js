const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');
const feedbackController = require('../controllers/feedback');

router.post('/feedback/create', [auth, validator.feedback], feedbackController.feedbackCreate);
router.get('/feedback/get', auth, feedbackController.feedbackGet);
router.delete('/feedback/delete/:id', auth, feedbackController.feedbackDeleteById);
router.delete('/feedback/delete', auth, feedbackController.feedbackDeleteAll);
router.post('/feedback/upload', auth, feedbackController.uploadFile);

module.exports = router;