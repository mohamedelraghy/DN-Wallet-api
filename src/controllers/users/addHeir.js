const Joi = require('joi');
const { User } = require('../../models/user');
const { Heir } = require('../../models/heir');

async function heir(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const accOwner = await User.findById(req.user._id);
    if(!accOwner) res.status(400).json({ "error": "User is not found" });

    const heir1 = await User.findOne({ email: req.body.first_heir });
    const heir2 = await User.findOne({ email: req.body.second_heir });

    if(heir1.email == accOwner.email || heir2.email == accOwner.email) return res.status(400).json({ "error" : "cannot make your self a heir" });
    
    if(!heir1) return res.status(400).json({ "error" : "Cannot find the first heir" });
    if(!heir2) return res.status(400).json({ "error" : "Cannot find the second heir" });

    const heir1Precentage = req.body.precentage;
    const heir2Precentage = 100 - req.body.precentage;

    const heir = new Heir({
        accOwner: accOwner.email,
        heir1: heir1.email,
        heir2: heir2.email,
        heir1Precentage: heir1Precentage,
        heir2Precentage: heir2Precentage
    });

    accOwner.willIsActive = true;
    
    await heir.save();
    await accOwner.save();

    return res.status(200).json({ "success": "The will will be executed after 90 days" });
}

function validate(req){

    const schema = {
        first_heir: Joi.string().min(5).max(255).required().email(),
        second_heir: Joi.string().min(5).max(255).required().email(),
        precentage: Joi.number().positive().required()
    }
    return Joi.validate(req, schema);
}

module.exports = heir;