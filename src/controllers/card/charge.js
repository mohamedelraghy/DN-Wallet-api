var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const mainAccount = '0xdea47E0C2737A1eCbc7a24D3941EeACBd8B44c3C';
const privateKey = Buffer.from('2d89465c993028ee619b22c92f08b9c572abe90c8800c8a610f6e65517236969','hex')
const contractAdress = '0x5E92b68b8ED963FF0e573104118f99Fc1a91BB3D'
const abi = [{"constant":false,"inputs":[{"name":"client","type":"address"},{"name":"uSd","type":"uint256"},{"name":"eGp","type":"uint256"},{"name":"eUr","type":"uint256"},{"name":"jPy","type":"uint256"}],"name":"changeCurrencies","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrency","outputs":[{"components":[{"name":"USD","type":"uint256"},{"name":"EGP","type":"uint256"},{"name":"EUR","type":"uint256"},{"name":"JPY","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"components":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"walletBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"TransactionCompleted","type":"event"}]
var dnwalletContract = new web3.eth.Contract(abi,contractAdress)


const { User } = require('../../models/user');
const { Card } = require('../../models/card'); 
const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');


async function charge(req, res) {

    
    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error" : error.details[0].message});

    const amount = req.body.amount;
    const currency = req.body.currency_code;
    const acc = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards cryptedAcc publicKey");
   
    const cardID = req.params.cardID;
    
    if (!ObjectId.isValid(cardID)) return res.status(400).json({ "error" : "Invalid ID"});

    const card = await Card.findById(cardID);
            
    const found = card.balance.find(balance => balance.currency_code == currency);
    if (!found) {
        return res.status(400).json({ "error" : "currency not avalible" });
        
    } else {  
        
        if(found.amount >= amount) found.amount -= amount;
        else return res.status(400).json({ "error" : "not enough amount" });
        
        chargeAccount(acc.publicKey, amount, currency);
        initialCurrency(acc.publicKey, amount, currency);
    }

    await card.save();
    
    return res.status(200).json(card);
}

function validate(req){
    
    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required()
    }

    return Joi.validate(req, schema);
}

const chargeAccount = async(toAddress,amount,currency) => {

    let etherValue;
    if(currency == 'USD')
    {
        etherValue = (amount + 1000) / 391;
        etherValue = etherValue.toString();
    }else if(currency == 'EGP')
    {
        etherValue = (amount + 1000) / 6256;
        etherValue = etherValue.toString();
    }else if(currency == 'EUR')
    {
        etherValue = (amount + 1000) / 334;
        etherValue = etherValue.toString();
    }else if(currency == 'JPY')
    {
        etherValue = (amount + 1000) / 41589;
        etherValue = etherValue.toString();
    }
    const ChargeFunctionData = dnwalletContract.methods.transferTo(toAddress,web3.utils.toWei(etherValue,'ether')).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
    to: contractAdress,
    value:web3.utils.toHex(web3.utils.toWei(etherValue,'ether')),
    data: ChargeFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash1 = web3.eth.sendSignedTransaction(raw);
  
  
  }
  
  
  const initialCurrency = async(toAddress,amount,currency) =>
  {
    var newChangeCurrency = [0,0,0,0];
    if(currency == 'USD')
    {
        newChangeCurrency[0] = amount;
    }else if(currency == 'EGP')
    {
        newChangeCurrency[1] = amount;
    }else if(currency == 'EUR')
    {
        newChangeCurrency[2] = amount;
    }else if(currency == 'JPY')
    {
        newChangeCurrency[3] = amount;
    }

    const accountHistory = await dnwalletContract.methods.getCurrency().call({from:toAddress});
    newChangeCurrency[0] += Number(accountHistory['USD']);
    newChangeCurrency[1] += Number(accountHistory['EGP']);
    newChangeCurrency[2] += Number(accountHistory['EUR']);
    newChangeCurrency[3] += Number(accountHistory['JPY']);
    
    const changeCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(toAddress,newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount + 1),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: contractAdress,
        data: changeCurrencyFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = web3.eth.sendSignedTransaction(raw);
  }

module.exports = charge;