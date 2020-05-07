const { Contact } = require('../../models/contacts');

async function showAll(req, res){
    const userID = req.user._id;
    const contacts = await Contact.find({ user: userID })
        .populate('user contacts.userID', '-_id -password -photo');

    if(!contacts) return res.status(400).json('No contacts Found');
    res.status(200).send(contacts);
}

module.exports = showAll;