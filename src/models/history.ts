const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    accountOwner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    consumption : {
        type : Number,
        default : 0
    },
    recevie : {
        type: Number,
        default : 0
    },
    donate : {
        type : Number,
        default : 0
    },
    result : [{
        id : {
            type: mongoose.Types.ObjectId,
        },
        email : String,
        amount : {
            type: Number,
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