const { User } = require('../../models/user');


async function Me (req, res){
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(400).json({ "error": "user not found" });
    
    

    res.status(200).json({"user": user });


}

module.exports = Me;