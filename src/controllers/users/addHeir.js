const Joi = require('joi');
const { User } = require('../../models/user');

async function heir(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const accOwner = await User.findById(req.user._id);
    if(!accOwner) res.status(400).json({ "error": "User is not found" });

    const heir1 = await User.findOne({ email: req.body.first_heir });
    const heir2 = await User.findOne({ email: req.body.second_heir });

    if(!heir1) return res.status(400).json({ "error" : "Cannot find the first heir" });
    if(!heir2) return res.status(400).json({ "error" : "Cannot find the second heir" });

    const heir1Precentage = req.body.precentage;
    const heir2Precentage = 100 - req.body.precentage;

    

}

function validate(req){

    const schema = {
        first_heir: Joi.string().min(5).max(255).required().email(),
        second_heir: Joi.string().min(5).max(255).required().email(),
        precentage: Joi.number().positive().required()
    }
    return Joi.validate(req, schema);
}

module.exports   = heir;