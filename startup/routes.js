const express = require('express');
const users = require('../models/user');


module.exports = function(app){
    app.use(express.json());
    app.use('/api/users', users);
}