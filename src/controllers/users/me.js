const { User } = require('../../models/user');


async function Me (req, res){
    const user = await User.findById(req.user._id).select('-_id -password');
    if(!user) return res.status(400).json('user not found');
    res.send(user);
}

module.exports = Me;