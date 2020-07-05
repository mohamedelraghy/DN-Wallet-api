const config = require('config');
const twilio = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));


async function sendCodeToEmail(req, res){

}

module.exports = sendCodeToEmail;