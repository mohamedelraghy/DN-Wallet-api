const { Contact } = require('../../models/contacts');
const ObjectId = require('mongoose').Types.ObjectId;

async function create(req, res){
    
    const contactID = req.params.id;
    if (!ObjectId.isValid(contactID)) return res.status(400).json('Invaild ID');
    
        
}

module.exports = create;