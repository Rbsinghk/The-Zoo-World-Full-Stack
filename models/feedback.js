const mongoose = require("mongoose");

const new_mongoose = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchemas",
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const feedbackSchema = new mongoose.model("feedbackSchema", new_mongoose);
module.exports = feedbackSchema;