const sendCode = require('./sendCode');
const codeCheck = require('./codeCheck');
const emailcode = require('./emailCode')
const checkActiveKey = require('./emailCodeCheck');

module.exports = {
    sendCode,
    codeCheck,
    emailcode,
    checkActiveKey
}

export {};