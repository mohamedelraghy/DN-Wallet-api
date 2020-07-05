const { User } = require('../../models/user');
const transporter = require('../../services/sendGrid');   
const Joi = require('joi');


async function forgetPassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });
    
    const user = await User.findOne({ email : req.body.email });
    if(!user) return res.status(400).json({ "error" : "User with the given email is not found"});

    code = generateCode(4);

    user.resetCode = code;
    user.resetCodeExpiration = Date.now() + 3600000;

    await user.save();

    await transporter.sendMail({
      to: req.body.email,
      from: "DN-Wallet@noreplay.com",
      subject: "Reset Password",
      html: `
            <p>You requested a password reset</p>
            <p>Use this code: ${code} to reset Your Password</p>       
        `,
    });

    return res.status(200).json({ "success": "Check your inbox" });
}

function generateCode(digit_num){
    return Math.floor(Math.random() * (9 * Math.pow(10, digit_num - 1))) + Math.pow(10, digit_num - 1); 
}

function validate(req){
    const schema = {
        email : Joi.string().min(5).max(255).required(),
    }
    return Joi.validate(req, schema);
}

module.exports = forgetPassword;