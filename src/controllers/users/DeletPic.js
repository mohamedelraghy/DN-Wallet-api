const { User } = require('../../models/user');

async function deletePic(req, res){

    const user = await User.findById(req.user._id);
    if(!user) return res.status(200).json('User not Found');

    user.photo = '';

    await user.save();

    return res.status(200).json('profile Picture Deleted');
}

module.exports = deletePic;