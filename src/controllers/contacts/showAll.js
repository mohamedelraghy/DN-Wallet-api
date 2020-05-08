const { Contact } = require('../../models/contacts');

async function showAll(req, res){
    const userID = req.user._id;
    const contacts = await Contact.find({ user: userID })
        .populate('user contacts.userID', ' -password -photo');

    if(!contacts) return res.status(400).json('No contacts Found');

    // sort contacts by name 
    contacts[0].contacts.sort((a, b) => {
        if(a.userID.name < b.userID.name) return -1;
        if(a.userID.name > b.userID.name) return 1;
        return 0;
    });

    res.status(200).send(contacts);
}

module.exports = showAll;