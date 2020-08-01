const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    balace : [{ type : Number }];
});

const Bank = mongoose.model('Bank', bankSchema);

exports.Bank = Bank;