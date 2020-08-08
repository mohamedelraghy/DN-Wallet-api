var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const mainAccount = '0xdea47E0C2737A1eCbc7a24D3941EeACBd8B44c3C';
const contractAddress = '0xfea5f0A6617fF11436252894FE6cF7ace96c296E';
const abi = [{"constant":false,"inputs":[{"name":"client","type":"address"},{"name":"uSd","type":"uint256"},{"name":"eGp","type":"uint256"},{"name":"eUr","type":"uint256"},{"name":"jPy","type":"uint256"}],"name":"changeCurrencies","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"currency","type":"string"}],"name":"transferTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrency","outputs":[{"components":[{"name":"USD","type":"uint256"},{"name":"EGP","type":"uint256"},{"name":"EUR","type":"uint256"},{"name":"JPY","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"components":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"transactionCurrency","type":"string"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var dnwalletContract = new web3.eth.Contract(abi, contractAddress);
const config = require('config');
const privateKey = Buffer.from(config.get('ethjsPrivateKey'), 'hex')




const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');
const { User } = require('../../models/user');
const { History } = require('../../models/history');


async function transfer(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });
    
    const amount = Number(req.body.amount);
    const currency = req.body.currency_code;
    const cardHolder = req.user._id;
    
    const sender = await User.findById(cardHolder).select("cards cryptedAcc publicKey email");
    const resiver = await User.findOne({ email : req.body.email }).select("_id cards cryptedAcc publicKey email");
    
    let history = History.find({ accountOwner: cardHolder });
    if (!history) {

      history = new History({
        accountOwner: user._id,
        consumption: 0,
        send: 0,
        donate: 0
      });
    }

    history.consumption += amount;
    history.send += amount;  

    const transaction = {
      to : resiver._id,
      amount : amount,
      currencuy_code : currency,
      date : Date.now(),
      category : 1,
      inner_category : 0
    }

    history.resulte.unshift(transaction);
    history.save();
    if(!sender || !resiver) return res.status(400).json({ "error" : "cannot send money" });

    
    // check for currency_code

    transferFromAccountTOAnother(sender.cryptedAcc,sender.email,resiver.publicKey,amount,currency);
    updataingFromAccountCurrenct(sender.publicKey,amount,currency,115704);
    updataingToAccountCurrenct(resiver.publicKey,amount,currency);
    return res.status(200).json({ "success" : "Transaction done successfully" });
}

function validate(req) {
    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY', 'SAR').required(),
        email : Joi.string().email().required()
    }
    return Joi.validate(req, schema);
}
 const transferFromAccountTOAnother = async(fromAddressJSON,fromEmail,toAddress,amount,currency) =>
 {
    const fromAccount = await web3.eth.accounts.decrypt(fromAddressJSON,fromEmail);
    let etherValue;
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:fromAccount['address']});
    let balance;
    if(currency == 'USD')
    {
        balance = accountCurrency[0];
        etherValue = amount / 391;
        etherValue = etherValue.toString();
    }else if(currency == 'EGP')
    {
        balance = accountCurrency[1];
        etherValue = amount / 6256;
        etherValue = etherValue.toString();
    }else if(currency == 'EUR')
    {
        balance = accountCurrency[2];
        etherValue = amount / 334;
        etherValue = etherValue.toString();
    }else if(currency == 'JPY')
    {
        balance = accountCurrency[3];
        etherValue = amount / 41589;
        etherValue = etherValue.toString();
    }
    if (amount >= balance)
    {
      return 0  //Cant countine with code in file
    }
    const transferFunctionData = dnwalletContract.methods.transferTo(toAddress,web3.utils.toWei(etherValue,'ether'),currency).encodeABI();
    const privKey = fromAccount['privateKey'].substring(2)
    const privateKeye = Buffer.from(privKey,'hex');
    const txCount = await web3.eth.getTransactionCount(fromAccount['address']);
    const txObject = 
    {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
    to: contractAddress,
    value:web3.utils.toHex(web3.utils.toWei(etherValue,'ether')),
    data: transferFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKeye);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = await web3.eth.sendSignedTransaction(raw);
}


const updataingFromAccountCurrenct = async(FromAddress,amount,currency,gasUsed) =>
  {
    let treansactionFees;
    treansactionFees = gasUsed / 100000000;
    var newChangeCurrency = [0,0,0,0];
    const accountHistory = await dnwalletContract.methods.getCurrency().call({from:FromAddress});
    if(currency == 'USD')
    {
      newChangeCurrency[0] = amount;
      treansactionFees =  treansactionFees * 391;
      newChangeCurrency[0] = Number(accountHistory['USD']) - (newChangeCurrency[0] + treansactionFees );
      newChangeCurrency[0] = newChangeCurrency[0].toFixed(0);
    }else if(currency == 'EGP')
    {
      newChangeCurrency[1] = amount;
      treansactionFees =  treansactionFees * 6256;
      newChangeCurrency[1] = Number(accountHistory['EGP']) - (newChangeCurrency[1] + treansactionFees );
      newChangeCurrency[1] = newChangeCurrency[1].toFixed(0);

     
    }else if(currency == 'EUR')
    {
      newChangeCurrency[2] = amount;
      treansactionFees =  treansactionFees * 334;
      newChangeCurrency[2] = Number(accountHistory['EUR']) - (newChangeCurrency[2] + treansactionFees );
      newChangeCurrency[2] = newChangeCurrency[2].toFixed(0);
    }else if(currency == 'JPY')
    {
      newChangeCurrency[3] = amount;
      treansactionFees =  treansactionFees * 41589;
      newChangeCurrency[3] = Number(accountHistory['JPY']) - (newChangeCurrency[3] + treansactionFees );
      newChangeCurrency[3] = newChangeCurrency[3].toFixed(0);
    }
    
  const updatingCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(FromAddress,newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: contractAddress,
        data: updatingCurrencyFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = web3.eth.sendSignedTransaction(raw);
  }

  const updataingToAccountCurrenct = async(ToAddress,amount,currency) =>
  {
    var newChangeCurrency = [0,0,0,0];
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:ToAddress});
    if(currency == 'USD')
    {
      newChangeCurrency[0] = amount;
      newChangeCurrency[0] = Number(accountCurrency['USD']) + (newChangeCurrency[0]);
      newChangeCurrency[0] = newChangeCurrency[0].toFixed(0);
    }else if(currency == 'EGP')
    {
      newChangeCurrency[1] = amount;
      newChangeCurrency[1] = Number(accountCurrency['EGP']) + (newChangeCurrency[1]);
      newChangeCurrency[1] = newChangeCurrency[1].toFixed(0);

     
    }else if(currency == 'EUR')
    {
      newChangeCurrency[2] = amount;
      newChangeCurrency[2] = Number(accountCurrency['EUR']) + (newChangeCurrency[2]);
      newChangeCurrency[2] = newChangeCurrency[2].toFixed(0);
    }else if(currency == 'JPY')
    {
      newChangeCurrency[3] = amount;
      newChangeCurrency[3] = Number(accountCurrency['JPY']) + (newChangeCurrency[3]);
      newChangeCurrency[3] = newChangeCurrency[3].toFixed(0);
    }
    
    const updatingCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(ToAddress,newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount + 1),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: contractAddress,
        data: updatingCurrencyFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = web3.eth.sendSignedTransaction(raw);
  }
module.exports = transfer;