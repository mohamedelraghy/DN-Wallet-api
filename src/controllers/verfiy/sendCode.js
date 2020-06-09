const config = require('config');
const twilio = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));
const Joi = require('joi');


async function sendCode(req, res){
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const phoneNumber = req.body.phoneNumber;
    if(phoneNumber[0] !== '+') return res.status(400).json('You should send country code');
    
    let verificationRequest;
    try{
        verificationRequest = await twilio.verify.services(config.get('twilio-service_id'))
                            .verifications
                            .create({
                                to : phoneNumber,
                                channel : 'sms'
                            });
    } catch(err) {
        return res.status(400).json({"error": err})
    }

    
    return res.status(200).json({ "Verfication code send successfully" : verificationRequest.status})
}

function validate(req) {
    const schema = {
        phoneNumber : Joi.string().min(11).required()
    }
    return Joi.validate(req, schema);
}

module.exports = sendCode;
