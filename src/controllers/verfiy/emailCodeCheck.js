const { User } = require('../../models/user');
const Joi = require('joi');

async function checkActiveKey(req, res){

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message} );

    const user = await User.findOne({ _id: req.user._id, emailCode: req.body.code, emailCodeExpiration: { $gt: Date.now() } }).select('-password');
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

    user.accountIsActive = true;
    user.emailCode = undefined;
    user.emailCodeExpiration = undefined;

    await user.save();

    return res.status(200).json({ "success" : "Account is activated", "accountIsActuve": user.accountIsActive });

}

function validate(req) {
    const schema = {
        code: Joi.string().min(4).max(4).required()
    }

    return Joi.validate(req, schema);
}

module.exports = checkActiveKey;