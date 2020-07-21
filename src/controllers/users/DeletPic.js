const { User } = require('../../models/user');
const config = require('config');

async function deletePic(req, res){

    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ "error": "User not Found" });

    user.photo = config.get('profilePic');

    await user.save();

    return res.status(200).json({ "success": "Photo deleted succussfully"} );
}

module.exports = deletePic;