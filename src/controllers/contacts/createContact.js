const { Contact } = require('../../models/contacts');
const { User } = require('../../models/user')
const ObjectId = require('mongoose').Types.ObjectId;

async function create(req, res){
    
    const contactID = req.params.id;
    if (!ObjectId.isValid(contactID)) return res.status(400).json('Invaild ID');
    
    const user = await User.findById(contactID);
    if(!user) return res.status(400).json('User With The Given ID is not Found');

    let contact = await Contact.findOne({user: req.user._id});
    if(!contact) {
        contact = new Contact({
            user: req.user._id
        });
    }
    
    const found = contact.contacts.find(contact => contact.userID == contactID); // cast to objectID 
    if(found) return res.status(400).json('Contact Already Exists');
    
    if(req.user._id == contactID) return res.status(400).json('You cannot Add yourself As a contact');

    const newConatct = {
        userID : contactID
    }

    contact.contacts.unshift(newConatct);

    await contact.save();
    res.status(200).json(contact)
}

module.exports = create;