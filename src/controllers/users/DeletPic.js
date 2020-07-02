const { User } = require('../../models/user');

async function deletePic(req, res){

    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ "error": "User not Found" });

    user.photo = '';

    await user.save();

    return res.status(200).json();
}

module.exports = deletePic;