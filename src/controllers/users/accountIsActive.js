const { User } = require('../../models/user');

async function accountIsActiv(req, res) {
    const user = await User.findById(req.user._id).select('accountIsActive');
    if (!user) return res.status(400).json({ "error": "user not found" }); 

    return res.status(200).json(user);
}


module.exports = accountIsActiv;