const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const charity = require('../routes/charity_orgs');
const contact = require('../routes/userContacts');
const verfiy = require('../routes/twilioVerfiy');


module.exports = function(app){
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/charity', charity);
    app.use('/api/contacts', contact);
    app.use('/api/verfiy', verfiy);
}