const { Heir } = require('../../models/heir');
const { User } = require('../../models/user');


async function listWill(req, res){

    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ "error": "Login Firts" });

    const will = await Heir.find({ accOwner: user.email });
    if(!will) return res.status(400).json({ "error": "No will for this account" });

    return res.status(200).json(will);
}


module.exports = listWill;

