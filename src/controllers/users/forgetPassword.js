const { User } = require('../../models/user');
const transporter = require('../../services/sendGrid');   
const Joi = require('joi');


async function forgetPassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });
    
    const user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).json({ "error" : "User with the given email is not found"});

    user.restCode = req.body.code;
    user.restCodeExpiration = Date.now() + 3600000;

    await user.save();

    await transporter.sendMail({
      to: req.body.email,
      from: "DN-Wallet@noreplay.com",
      subject: "Reset Password",
      html: `
            <p>You requested a password reset</p>
            <p>Use this code: ${req.body.code}  to rest Your Password</p>       
        `,
    });

    return res.status(200);

}

function validate(req){
    const schema = {
        email : Joi.string().min(5).max(255).required(),
        code : Joi.string().required()
    }
    return Joi.validate(req, schema);
}

module.exports = forgetPassword;