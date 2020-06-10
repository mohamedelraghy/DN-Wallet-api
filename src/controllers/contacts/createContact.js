const { Contact } = require('../../models/contacts');
const { User } = require('../../models/user')
const Joi = require('joi');

async function create(req, res){


    
    const user = await User.find({"email" : req.body.email});
    if(!user) return res.status(400).json( { "id": null, "error": "User With The Given Email is not Found"} );

    let contact = await Contact.findOne({user: req.user._id});
    if(!contact) {
        contact = new Contact({
            user: req.user._id
        });
    }
    
    if (req.user._id == user._id) return res.status(400).json({ "id": null, "error": "You cannot Add yourself As a contact"});
   
    const found = contact.contacts.find(contact => contact.userID == user._id); // cast to objectID 
    if (found) return res.status(400).json({ "id": null, "error": "Contact Already Exists" });
    

    const newConatct = {
        userID : user._id
    }

    contact.contacts.unshift(newConatct);

    await contact.save();
    res.status(200).json({ "id": user._id, "error": null })
}



module.exports = create;