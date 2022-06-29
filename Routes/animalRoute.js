const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const animalController = require('../controllers/animals');

router.post('/animal/create', auth, animalController.createAnimal);
router.get('/animal/getAll', auth, animalController.getAllAnimal);
router.get('/animal/get/:id', animalController.getAnimalById);
router.patch('/animal/update/:id', auth, animalController.updateAnimal);
router.delete('/animal/delete/:id', auth, animalController.deleteAnimal);

module.exports = router;