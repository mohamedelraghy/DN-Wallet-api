const config = require('config');
const client = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));

async function sendCode(req, res){

    const send = await client
                            .verify
                            .services(config.get('twilio-service_id'))
                            .create({
                                to : req.phoneNumber,
                                channel : 'sms'
                            })

    res.json(send)
}

module.exports = sendCode;
