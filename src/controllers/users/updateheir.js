const { User } = require('../../models/user');
const { Heir } = require('../../models/heir');
const Joi = require('joi');


async function editWill(req, res){
    
    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });

    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ "error" : "Login First" });

    const heir1 = await User.findOne({ email: req.body.first_heir });
    if(!heir1) return res.status(400).json({ "error": "cannot find heir 1" });

    const heir2 = await User.findOne({ email: req.body.second_heir });
    if (!heir2) return res.status(400).json({ "error": "cannot find heir 2" });

    if (heir1.email == user.email || heir2.email == user.email) return res.status(400).json({ "error": "cannot make your self a heir" });

    let will = await Heir.updateOne({ accOwner: user.email }, {
        $set:{
            heir1: req.body.first_heir,
            heir2: req.body.second_heir,
            heir1Precentage: req.body.precentage,
            heir2Precentage: 100 - req.body.precentage
        }
    });


    return res.status(200).json({ "success": "Will updatted Successfully" });
}

function validate(req) {

    const schema = {
        first_heir: Joi.string().min(5).max(255).required().email(),
        second_heir: Joi.string().min(5).max(255).required().email(),
        precentage: Joi.number().positive().max(100).required()
    }
    return Joi.validate(req, schema);
}

module.exports = editWill;