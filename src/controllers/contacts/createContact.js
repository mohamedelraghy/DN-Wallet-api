const { Contact } = require('../../models/contacts');
const { User } = require('../../models/user')
const Joi = require('joi');

async function create(req, res){

    const { error } = validate(req.body);
    if(error) return res.status(400).json({"id": null, "error": error.details[0].message});
    
    const user = await User.findOne({"email" : req.body.email});
    if(!user) return res.status(400).json( { "id": null, "error": "User With The Given Email is not Found"} );

    const contactID = user._id.toString()
    
    let contact = await Contact.findOne({user: req.user._id});
    if(!contact) {
        contact = new Contact({
            user: req.user._id
        });
    }    
    
    if (req.user._id == contactID) return res.status(400).json({ "id": null, "error": "You cannot Add yourself As a contact"});

    const found = contact.contacts.find(contact => contact.userID == contactID ); 
    
    if(found) return res.status(400).json({ "id": null, "error": "Contact Already Exists" });

    const newConatct = {
        userID : contactID
    }

    contact.contacts.unshift(newConatct);

    await contact.save();

    res.status(200).json({ "id": user._id, "email": user.email, "name": user.name, "error": null });
    
}

function validate(req){
    const schema = {
        "email" : Joi.string().min(5).max(255).email().required()
    }
    return Joi.validate(req, schema);
}

module.exports = create;