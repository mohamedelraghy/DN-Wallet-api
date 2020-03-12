const express = require('express');
const users = require('../routes/users');


module.exports = function(app){
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use('/api/users', users);
}