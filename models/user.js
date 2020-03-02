const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength: 5,
        maxlength: 50
    },
    email : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 50,
        unique : true
    },
    gender : {
        type : String,
        enum : ['Male', 'Female']
    },
    phone : {
        type : String,
        maxlength : 11
    },
    password : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 1024
    },
    job : {
        type : String,
        minlength : 5,
        maxlength : 50
    }
});

const User = mongoose.model('User', userSchema);

