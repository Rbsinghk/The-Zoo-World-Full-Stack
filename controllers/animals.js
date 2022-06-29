const multer = require('multer');
const valid = require("validator");
const animalSchema = require('../models/animals');

const Storage = multer.diskStorage({
    destination: 'public/animalsImage',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: Storage
}).single('animalImage');

const createAnimal = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            try {
                const { name, species, age } = req.body;
                if (valid.isEmpty(name)) {
                    res.json({ messsage: "Name not be empty" });
                }
                else if (valid.isEmpty(species)) {
                    res.json({ messsage: "Species no is not empty" });
                }
                else if (valid.isEmpty(age)) {
                    res.json({ messsage: "Age not be empty" });
                }
                else {
                    const newAnimal = new animalSchema({
                        imageName: req.file.filename,
                        name: req.body.name,
                        species: req.body.species,
                        age: req.body.age
                    });
                    newAnimal.save()
                        .then(() => res.json( 'Success',
                            // file: `uploads/${req.file.filename}`
                        ))
                        .catch((err) => res.send("err"));
                }
            } catch (error) {
                res.send(error.message)
            }
        }
    })
}

const getAllAnimal = async (req, res) => {
    try {
        const getAllAnimal = await animalSchema.find(req.body);
        res.status(201).send(getAllAnimal);
    } catch (error) {
        res.status(401).send(error);
    }
}

const getAnimalById = async (req, res) => {
    try {
        const _id = req.params.id;
        const getAnimalProfile = await animalSchema.findById(_id);
        res.send(getAnimalProfile);
    } catch (error) {
        res.status(error);
    }
}

const updateAnimal = async (req, res) => {
    try {
        const _id = req.params.id;
        const animalProfileUpdate = await animalSchema.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        });
        res.send(animalProfileUpdate);
    } catch (error) {
        res.status(500).send(error);
    }
}

const deleteAnimal = async (req, res) => {
    try {
        const animalProfileDelete = await animalSchema.findByIdAndDelete(req.params.id);
        res.send(animalProfileDelete);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    createAnimal,
    getAllAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal
};