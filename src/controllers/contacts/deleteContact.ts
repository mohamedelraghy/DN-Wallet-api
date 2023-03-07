const { Contact } = require('../../models/contacts');
const { User } = require('../../models/user')
const ObjectId = require('mongoose').Types.ObjectId;

async function deleteContact(req, res){

    const removedContactID = req.params.id;
    if (!ObjectId.isValid(removedContactID)) return res.status(400).json({"error": "Invaild ID"});

    const user = await User.findById(removedContactID);
    if (!user) return res.status(400).json({ "error": "User With The Given ID is not Found"});

    let contact = await Contact.findOne({ user: req.user._id });
    if(!contact) return res.status(400).json({ "error": "No contact with the given ID" });
    
    const removedContactIndex = contact.contacts.findIndex(contact => contact.userID == removedContactID);
    if(removedContactIndex === -1) return res.status(400).json({ "error": "No Such a Contact"})
    contact.contacts.splice(removedContactIndex, 1);

    await contact.save();

    res.status(200).json({ "success": "Contact deleted Successfully" });
}

module.exports = deleteContact;

export {};