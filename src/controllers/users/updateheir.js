const { User } = require('../../models/user');
const { Heir } = require('../../models/heir');
const Joi = require('joi');


async function editWill(req, res){
    
    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });
    
    const user = await User.findById(req.user_id);
    if(!user) res.status(400).json({ "error" : "Login First" });

    let will = await Heir.find({accOwner: user.email});
    if(will.length == 0) return res.status(400).json({ "error": "No Will to edit" });

    will.heir2 = heir2.email,
    will.heir1 = heir1.email,
    will.heir1Precentage = heir1Precentage,
    will.heir2Precentage = heir2Precentage

    await will.save();

    return res.status(400).json({ "success": "Will updatted Successfully" });
}

function validate(req) {

    const schema = {
        first_heir: Joi.string().min(5).max(255).required().email(),
        second_heir: Joi.string().min(5).max(255).required().email(),
        precentage: Joi.number().positive().required()
    }
    return Joi.validate(req, schema);
}

module.exports = editWill;