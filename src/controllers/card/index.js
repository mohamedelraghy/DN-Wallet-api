const createCard = require('./create');
const cards  = require('./cardinfo');
const charge = require('./charge');
const transfer = require('./transfer');
const withdraw = require('./Withdrawal');
const getBalance = require('./getBalance');
const history = require('./histroy');


module.exports = {
    createCard,
    cards,
    charge,
    transfer,
    withdraw,
    getBalance,
    history
}
