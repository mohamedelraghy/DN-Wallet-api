const { User } = require('../../models/user');

async function editUser(req, res) {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(400).json('User not Found');

    const country = user.country;
    const gender = user.gender;
    const job = user.job;

    if(!req.body.country) user.country = country;
    else user.country = req.body.country;

    if(!req.body.gender) user.gender = gender;
    else user.gender = req.body.gender;

    if(!req.body.job) user.job = job;
    else user.job = req.body.job;

    await user.save();
    
    return res.status(200).json('User info edit successfully');
}

module.exports = editUser;