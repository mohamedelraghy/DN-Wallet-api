const config = require('config');

module.exports = function(){
    if(!config.get('jwtKey'))throw new Error('FATAL ERROR: jwtKey is not defined.');
    if (!config.get('cloud_name')) throw new Error('FATAL ERROR: cloud_name is not defined');
    if (!config.get('api_key')) throw new Error('FATAL ERROR: api_key is not define.');
    if (!config.get('api_secret')) throw new Error('FATAL ERROR: api_secret is not define.');
}