const config = require('config');
const twilio = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));

async function codeCheck(req, res){
    const code = req.body.code;
    let verificationResult;

    try{
        verificationResult = await twilio.verify.services(config.get('twilio-service_id'))
                                        .verificationChecks
                                        .create({
                                            code ,
                                            to : req.body.phoneNumber
                                        });
    }catch(err) {
        return res.status(400).json({ "error": err })
    }

    return res.status(200).json({ "Verified": verificationResult.status });

}

module.exports = codeCheck;