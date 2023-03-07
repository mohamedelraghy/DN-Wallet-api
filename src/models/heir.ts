const mongoose = require('mongoose');

const heirSchema = new mongoose.Schema({
    accOwner: {
        type: String,
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    heir1: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    heir2: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    heir1Precentage: Number,
    heir2Precentage: Number
});

const Heir = mongoose.model('Heir', heirSchema);

exports.Heir = Heir;