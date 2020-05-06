const mongoose = require('mongoose');

const contactsSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    constacts : {
        type : [mongoose.Types.ObjectId],
        ref : 'User'
    }
});

const Contact = mongoose.model('Contact', contactsSchema);


exports.Contact = Contact;