const cors = require('cors');
const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const charity = require('../routes/charity_orgs');
const contact = require('../routes/userContacts');
const verfiy = require('../routes/twilioVerfiy');
const emailActive = require('../routes/activeEmail');
const cards = require('../routes/cards');
const bank = require('../routes/banks');

module.exports = function(app){
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    // app.use((req, res, next) => {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    //     // Origin, X-Requested-With, Content-Type, Content-Disposition, Accept, x-auth-token, authorization
    //     res.header("Access-Control-Allow-Headers", "*");
    //     next();
    // });
    app.use(cors());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/charity', charity);
    app.use('/api/contacts', contact);
    app.use('/api/verfiy', verfiy);
    app.use('/api/verfiy/email', emailActive);
    app.use('/api/cards', cards);
    app.use('/api/bank', bank);
}