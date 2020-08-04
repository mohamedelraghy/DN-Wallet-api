var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const mainAccount = '0xdea47E0C2737A1eCbc7a24D3941EeACBd8B44c3C';
const contractAdress = '0x5E92b68b8ED963FF0e573104118f99Fc1a91BB3D'
const abi = [{"constant":false,"inputs":[{"name":"client","type":"address"},{"name":"uSd","type":"uint256"},{"name":"eGp","type":"uint256"},{"name":"eUr","type":"uint256"},{"name":"jPy","type":"uint256"}],"name":"changeCurrencies","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrency","outputs":[{"components":[{"name":"USD","type":"uint256"},{"name":"EGP","type":"uint256"},{"name":"EUR","type":"uint256"},{"name":"JPY","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"components":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"walletBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"TransactionCompleted","type":"event"}]
var dnwalletContract = new web3.eth.Contract(abi,contractAdress)




const { User } = require('../../models/user');
const { Card } = require('../../models/card');
const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');

async function withdraw(req, res) {

    const { error } = validate(req.body);
    if(error) res.status(400).json({ "error" : error.details[0].message });

    const amount = req.body.amount;
    const currency = req.body.currency_code;
    
    const user = await User.findById(req.user._id).select("cards cryptedAcc publicKey email");
    if(!user) res.status(400).json({ "error" : "User not fount" });

    const cardID = req.params.cardID;
    if(!ObjectId.isValid(cardID)) return res.status(400).json({"error" : "Invalid ID"});

    const card = await Card.findById(cardID);
    if(!card) return res.status(400).json({ "error" : "card not found" });

    const found = card.balance.find(balance => balance.currency_code == currency);
    if(!found) {
        found.amount = amount;
        found.currency_code = currency;
    } else {
        found.amount += amount
        const gas =  withdrawFromAccount(user.cryptedAcc,user.email,amount,currency);
        updataingCurrenct(user.cryptedAcc,user.email,amount,currency,gas);
    }

    card.save();

    return res.status(400).json(card);
}

function validate(req) {

    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required()
    }

    return Joi.validate(req, schema);
}
const withdrawFromAccount = async(JSONfile,userEmail,amount,currency) =>
{
    const userAccount = await web3.eth.accounts.decrypt(JSONfile,userEmail);
    let etherValue;
    var newChangeCurrency = [0,0,0,0];
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:userAccount['address']});
    const balance;
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
      console.log('unable to make transaction');
      return 0
    }

    const ChargeFunctionData = dnwalletContract.methods.transferTo(mainAccount,web3.utils.toWei(etherValue,'ether')).encodeABI();
    const privKey = userAccount['privateKey'].substring(2)
    const privateKeye = Buffer.from(privKey,'hex');
    
    const txCount = await web3.eth.getTransactionCount(userAccount['address']);
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
    tx.sign(privateKeye);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = await web3.eth.sendSignedTransaction(raw);
    console.log(txHash);
    const transactionInfo = await web3.eth.getTransactionReceipt(txHash);
    console.log(transactionInfo);
    return(transactionInfo['gasUsed']);
  }



  const updataingCurrenct = async(JSONfile,userEmail,amount,currency,gasUsed) =>
  {
    const userAccount = await web3.eth.accounts.decrypt(JSONfile,userEmail);
    let treansactionFees;
    treansactionFees = gasUsed / 100000000;
    var newChangeCurrency = [0,0,0,0];
    const accountHistory = await dnwalletContract.methods.getCurrency().call({from:userAccount['address']});
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
      console.log(newChangeCurrency[1]);
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
    const changeCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(userAccount['address'],newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount),
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
module.exports = withdraw;
