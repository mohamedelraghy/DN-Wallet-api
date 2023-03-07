const { Contact } = require('../../models/contacts');

async function showAll(req, res){

    const userID = req.user._id;
    const contacts = await Contact.find({ user: userID })
        .populate('user contacts.userID', ' -password');

    if (!contacts || contacts.length === 0 || contacts === undefined) return res.status(200).json([]);
    
    // sort contacts by name
    if(contacts[0].contacts){
        contacts[0].contacts.sort((a, b) => {
            if(a.userID.name < b.userID.name) return -1;
            if(a.userID.name > b.userID.name) return 1;
            return 0;
        });
    }

    res.status(200).json(contacts[0].contacts);
}

module.exports = showAll;