var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const contractAdress = '0xfea5f0A6617fF11436252894FE6cF7ace96c296E';
const abi = [{"constant":false,"inputs":[{"name":"client","type":"address"},{"name":"uSd","type":"uint256"},{"name":"eGp","type":"uint256"},{"name":"eUr","type":"uint256"},{"name":"jPy","type":"uint256"}],"name":"changeCurrencies","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"currency","type":"string"}],"name":"transferTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrency","outputs":[{"components":[{"name":"USD","type":"uint256"},{"name":"EGP","type":"uint256"},{"name":"EUR","type":"uint256"},{"name":"JPY","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"components":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"transactionCurrency","type":"string"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var dnwalletContract = new web3.eth.Contract(abi,contractAdress);



const { User } = require('../../models/user');
const Joi = require('joi');


async function exchange(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const user = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards cryptedAcc publicKey email");

    if(!user) return res.status(400).json({ "error" : "User is not found" });

    const curr_from = req.body.curr_from;
    const curr_to = req.body.curr_to;
    const amount = req.body.amount;



    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:user.publicKey});
    var checkCurrency;
    if(curr_from == 'USD')
    {
        checkCurrency = Number(accountCurrency['USD']);
    }else if(curr_from == 'EGP')
    {
        checkCurrency = Number(accountCurrency['EGP']);
    }else if(curr_from == 'EUR')
    {
        checkCurrency = Number(accountCurrency['EUR']);
    }
    else if(curr_from == 'JPY')
    {
        checkCurrency = Number(accountCurrency['JPY']);
    }
    if(checkCurrency <= amount)
    {
        return res.status(400).json({ "error": "not enough money" });
    }

    exchangeCurrency(user.cryptedAcc,user.email,curr_from,curr_to,amount,115704);


    return res.status(200).json({ "success" : "exchange done successfully" });
}

function validate(req) {

    const schema = {
        curr_from: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required(),
        curr_to: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required(),
        amount: Joi.number().required().positive()
    }
    return Joi.validate(req, schema);
}

const exchangeCurrency = async(AccountJSON,email,oldCurrency,newCurrency,amount,gasUsed) =>
{
    let treansactionFees;
    treansactionFees = gasUsed / 100000000;
    const userAccount = await web3.eth.accounts.decrypt(AccountJSON,email);
    const privKey = userAccount['privateKey'].substring(2)
    const privateKeye = Buffer.from(privKey,'hex');
    var newChangeCurrency = [0,0,0,0];
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:userAccount['address']});
    newChangeCurrency[0] = Number(accountCurrency['USD']);
    newChangeCurrency[1] = Number(accountCurrency['EGP']);
    newChangeCurrency[2] = Number(accountCurrency['EUR']);
    newChangeCurrency[3] = Number(accountCurrency['JPY']);

    if(oldCurrency == 'USD')
    {
        treansactionFees =  treansactionFees * 391;
        newChangeCurrency[0] -= (amount + treansactionFees);
        if(newCurrency == 'EGP')
        {
            newChangeCurrency[1] += (amount * 15.98);
        }else if(newCurrency == 'EUR')
        {
            newChangeCurrency[2] += (amount * 0.85);
        }else if(newCurrency == 'JPY')
        {
            newChangeCurrency[3] += (amount * 105.87);
        }
    }else if(oldCurrency == 'EGP')
    {
        treansactionFees =  treansactionFees * 6256;
        newChangeCurrency[1] -= (amount + treansactionFees);
        if(newCurrency == 'USD')
        {
            newChangeCurrency[0] += (amount * 0.063);
        }else if(newCurrency == 'EUR')
        {
            newChangeCurrency[2] += (amount * 0.053);
        }else if(newCurrency == 'JPY')
        {
            newChangeCurrency[3] += (amount * 6.62);
        }

    }else if(oldCurrency == 'EUR')
    {
        treansactionFees =  treansactionFees * 334;
        newChangeCurrency[2] -= (amount + treansactionFees);
        if(newCurrency == 'USD')
        {
            newChangeCurrency[0] += (amount * 1.18);
        }else if(newCurrency == 'EGP')
        {
            newChangeCurrency[1] += (amount * 18.83);
        }else if(newCurrency == 'JPY')
        {
            newChangeCurrency[3] += (amount * 124.66);
        }

    }else if(oldCurrency == 'JPY')
    {
        treansactionFees =  treansactionFees * 41589;
        newChangeCurrency[3] -= (amount + treansactionFees);
        if(newCurrency == 'USD')
        {
            newChangeCurrency[0] += (amount * 0.0095);
        }else if(newCurrency == 'EGP')
        {
            newChangeCurrency[1] += (amount * 0.15);
        }else if(newCurrency == 'EUR')
        {
            newChangeCurrency[2] += (amount * 0.0080);
        }

    }
    newChangeCurrency[0] = newChangeCurrency[0].toFixed(0);
    newChangeCurrency[1] = newChangeCurrency[1].toFixed(0);
    newChangeCurrency[2] = newChangeCurrency[2].toFixed(0);
    newChangeCurrency[3] = newChangeCurrency[3].toFixed(0);


    const updataingCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(userAccount['address'],newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(userAccount['address']);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: contractAdress,
        data: updataingCurrencyFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKeye);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = web3.eth.sendSignedTransaction(raw);



}

module.exports = exchange;

