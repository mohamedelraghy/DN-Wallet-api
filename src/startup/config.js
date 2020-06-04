const config = require('config');

module.exports = function(){
    if (!config.get('jwtKey'))throw new Error('FATAL ERROR: jwtKey is not defined.');
    if (!config.get('cloud_name')) throw new Error('FATAL ERROR: cloud_name is not defined');
    if (!config.get('api_key')) throw new Error('FATAL ERROR: api_key is not define.');
    if (!config.get('api_secret')) throw new Error('FATAL ERROR: api_secret is not define.');
    if (!config.get('twilio-service_id')) throw new Error('FATAL ERROR: Twilio SERVICE ID is not define.');
    if (!config.get('twilio-account_sid')) throw new Error('FATAL ERROR: Twilio ACCOUNT SID is not define.');
    if (!config.get('twilio-auth_token')) throw new Error('FATAL ERROR: Twilio AUTH TOKEN is not define.');
    if (!config.get('sendGrid-api_key')) throw new Error('FATAL ERROR: SendGrid API_key is not define.')
}