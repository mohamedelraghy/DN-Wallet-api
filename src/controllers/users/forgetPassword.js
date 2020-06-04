const { User } = require('../../models/user');
const transporter = require('../../services/sendGrid');   
const Joi = require('joi');


async function forgetPassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).json({ "error" : "User with the given ID is not found"});

    const token = user.generateAuthToken();

    user.restToken = token;
    user.restTokenExpiration = Date.now() + 3600000;

    await user.save();

    await transporter.sendMail({
      to: req.body.email,
      from: "DN-Wallet@noreplay.com",
      subject: "Reset Password",
      html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="https://hidden-sea-27440.herokuapp.com/api/users/rest-password/${token}">link</a> to set a new password.</p>       
        `,
    });

    return res.status(200).json({"message": "Email Sent Successfully"})

}

function validate(req){
    const schema = {
        email : Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = forgetPassword;