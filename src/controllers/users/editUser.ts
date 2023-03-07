const { User } = require('../../models/user');
const Joi = require('joi');

async function editUser(req, res) {

    const { error } = Validate(req.body);
    if(error) return res.status(400).json({ "error" : error.details[0].message });

    let user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ "error": "User not Found" });

    for (const key in req.body) {
        user[key] = req.body[key];
    }
   
    await user.save();
    
    return res.status(200).json({ "success": "User data updated successfully" });
}

function Validate(req){
    const schema = {
        gender: Joi.string().valid('Male', 'Female'),
        job: Joi.string().min(5).max(50),
        country: Joi.string()
    }

    return Joi.validate(req, schema);
}


module.exports = editUser;