const { User } = require('../../models/user');

async function editUser(req, res) {
    let user = await User.findByIdAndUpdate({_id: req.user._id}, {
        $set: {
            country: req.body.country,
            gender: req.body.gender,
            job: req.body.job 
        }
    }, {new: true});

    if(!user) return res.status(400).json('User not Found');

    console.log(req.body);
    console.log(user);
}

module.exports = editUser;