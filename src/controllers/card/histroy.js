const { User } = require('../../models/user');

async function history(req, res) {

    const user = await User.findById(req.user._id).select("cards cryptedAcc publicKey email");
    if(!user) return res.status(400).json({ "error" : "user with the give ID is not found" });

    

}


module.exports = history;