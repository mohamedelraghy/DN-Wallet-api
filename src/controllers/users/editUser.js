const { User } = require('../../models/user');

async function editUser(req, res) {
    const user = await User.findById(req.user._id).select('-_id -password');

    if(!user) return res.status(400).json('User not Found');

    console.log(user);
}

module.exports = editUser;