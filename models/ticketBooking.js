const mongoose = require("mongoose");

const new_mongoose = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
    },
    kids: {
        type: Number,
        required: true
    },
    adult: {
        type: Number,
        required: true
    },
    srCitizen: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: String,
        required: true,
    },
    dateOfVisit: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ticketSchema = new mongoose.model("ticketSchema", new_mongoose);
module.exports = ticketSchema;