const helmet = require('helmet');
const comperssion = require('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(comperssion()); 
}
