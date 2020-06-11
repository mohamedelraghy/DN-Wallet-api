const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');


async function restPassword(req, res) {

    const token = req.params.token;
    const user = await User.findOne({ restToken: token, restTokenExpiration: { $gt: Date.now()}});

    if(!user) return res.status(400).json({"error" : "Invalid Token"});

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.restToken = undefined;
    user.restTokenExpiration = undefined;

    await user.save();

    res.status(200).json({"error" : null});

}

module.exports = restPassword;