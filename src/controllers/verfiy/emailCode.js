const { User } = require('../../models/user');
const transporter = require('../../services/sendGrid');

async function sendCodeToEmail(req, res){

    const user = await User.findById(req.user._id).select('-password');    
    const code = generateCode(4);

    user.emailCode = code;
    user.emailCodeExpiration = Date.now() + 3600000;

    await user.save();

    await transporter.sendMail({
        to: user.email,
        from: "DN-Wallet@noreplay.com",
        subject: "Active You DN-Wallet",
        html: `
            <p>You just register on DN-Wallet</p>
            <p>Use this code: ${code} to acctive you Wallet</p>       
        `,
    });

    return res.status(200).json({ "success": "Check you inbox" });

}

function generateCode(digit_num) {
    return Math.floor(Math.random() * (9 * Math.pow(10, digit_num - 1))) + Math.pow(10, digit_num - 1);
}

module.exports = sendCodeToEmail;