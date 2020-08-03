const { User } = require('../../models/user');

async function withdraw(req, res) {
    
    const user = await User.findById(req.user._id);
}

module.exports = withdraw;