const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    accountOwner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    consumption : {
        type : Number
    },
    send : {
        type: Number
    },
    donate : {
        type : Number
    },
    resulte : [{
        transactionOwner : {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        amount : {
            type: Number
        },
        currencuy_code : {
            type : String
        },
        date : Date,
        category : {
            type : String
        },
        inner_category : {
            type : String
        }
    }]
});

const History = mongoose.model('Histroy', historySchema);

exports.History = History;