const config = require('config');
const twilio = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));

async function sendCode(req, res){

    const phoneNumber = req.body.phoneNumber;
    if(phoneNumber[0] !== '+') return res.status(400).json('You should send country code');
    
    let verificationRequest;
    try{
        verificationRequest = await twilio.verify.services(config.get('twilio-service_id'))
                            .verifications
                            .create({
                                to : req.body.phoneNumber,
                                channel : 'sms'
                            });
    } catch(err) {
        return res.status(400).json({"error": err})
    }

    
    return res.status(200).json({ "Verfication code send successfully" : verificationRequest.status})
}

module.exports = sendCode;
