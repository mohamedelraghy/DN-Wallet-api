const { User } = require('../../models/user');


async function Me (req, res){
    const user = await User.findById(req.user._id).select('-_id -password');
    res.send(user);
}

module.exports = Me;