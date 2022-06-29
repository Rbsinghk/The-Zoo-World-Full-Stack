const mongoose = require("mongoose");

const new_mongoose = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    imageName:{
        type:String
    },
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const animalSchema = new mongoose.model("animalSchema", new_mongoose);
module.exports = animalSchema;