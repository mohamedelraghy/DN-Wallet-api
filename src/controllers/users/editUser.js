const { User } = require('../../models/user');

async function editUser(req, res) {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(400).json('User not Found');


    for (const key in req.body) {
        user[key] = req.body[key];
    }
   
    await user.save();
    
    return res.status(200).json('User info edit successfully');
}

module.exports = editUser;