const { Contact } = require('../../models/contacts');
const { User } = require('../../models/user')
const ObjectId = require('mongoose').Types.ObjectId;

async function create(req, res){
    
    const contactID = req.params.id;
    if (!ObjectId.isValid(contactID)) return res.status(400).json('Invaild ID');
    
    const user = await User.findById(contactID);
    if(!user) res.status(400).json('User With The Given ID is not Found');

    let contact = new Contact({
        user : req.user.id,
        constacts : [contactID]
    });

    await contact.save();
}

module.exports = create;