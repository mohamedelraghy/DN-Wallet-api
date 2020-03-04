const express = require('express');
const users = require('../routes/users');


module.exports = function(app){
    app.use(express.json());
    app.use('/api/users', users);
}