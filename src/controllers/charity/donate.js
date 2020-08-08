var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const mainAccount = '0xdea47E0C2737A1eCbc7a24D3941EeACBd8B44c3C';
const contractAddress = '0xfea5f0A6617fF11436252894FE6cF7ace96c296E';
const abi = [{"constant":false,"inputs":[{"name":"client","type":"address"},{"name":"uSd","type":"uint256"},{"name":"eGp","type":"uint256"},{"name":"eUr","type":"uint256"},{"name":"jPy","type":"uint256"}],"name":"changeCurrencies","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"currency","type":"string"}],"name":"transferTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrency","outputs":[{"components":[{"name":"USD","type":"uint256"},{"name":"EGP","type":"uint256"},{"name":"EUR","type":"uint256"},{"name":"JPY","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHistory","outputs":[{"components":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"transactionCurrency","type":"string"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var dnwalletContract = new web3.eth.Contract(abi, contractAddress);
const config = require('config');
const privateKey = Buffer.from(config.get('ethjsPrivateKey'), 'hex')

const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;
const { User } = require('../../models/user');
const { History } = require('../../models/history');

async function donate(req, res) {

    const amount = Number(req.body.amount);
    const currency = req.body.currency_code;

    const id = req.params.id;
    if(!ObjectId.isValid(id)) return res.status(400).json({ "error": "InValid ID" });

    let chariy = await Charity.findById(id).select("email publicKey donation_number");
    if(!chariy) return res.status(400).json({ "error": "Charity with the given ID not found" });

    const user = await User.findById(req.user._id).select('cryptedAcc publicKey email');
    if(!user) return res.status(400).json({ "error" : "user with the given ID is not found" });
    
    let history = await History.findOne({ accountOwner: req.user._id });

    if (!history) {
      history = new History({
        accountOwner: req.user._id,
      });
    }

    history.consumption += amount;
    history.donate += amount;  
    console.log(chariy.email);
    const transaction = {
      id: chariy._id,
      email: chariy.email,
      amount: amount,
      currencuy_code: currency,
      date: Date.now(),
      category: 0,
      inner_category: 0
    }

    history.result.unshift(transaction);
    await history.save();

    donateFromAccount(res,user.cryptedAcc,user.email,amount,chariy.publicKey, currency);
    updataingCurrency(user.publicKey,amount,currency,115704);
    updatingCharityCurrency(chariy.publicKey, amount, currency);

    chariy.donation_number += 1;
   

    await chariy.save();
    res.status(200).json({ "success": "❤️جزاك الله كل خيرا" });
}

 
const donateFromAccount = async(res, JSONfile,userEmail,amount,charityAccount,currency) =>
{
 
    const userAccount = await web3.eth.accounts.decrypt(JSONfile,userEmail);
    let etherValue;
    var newChangeCurrency = [0,0,0,0];
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:userAccount['address']});
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
       return res.status(400).json({ "error": "not enough money" });
    }
    
    
    const donateFunctionData = dnwalletContract.methods.transferTo(charityAccount,web3.utils.toWei(etherValue,'ether'),currency).encodeABI();
    const privKey = userAccount['privateKey'].substring(2)
    const privateKeye = Buffer.from(privKey,'hex');
    
    const txCount = await web3.eth.getTransactionCount(userAccount['address']);
    const txObject = 
    {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
    to: contractAddress,
    value:web3.utils.toHex(web3.utils.toWei(etherValue,'ether')),
    data: donateFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKeye);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = await web3.eth.sendSignedTransaction(raw);
  }

  const updataingCurrency = async(userAccount,amount,currency,gasUsed) =>
  {
    let treansactionFees;
    treansactionFees = gasUsed / 100000000;
    var newChangeCurrency = [0,0,0,0];
    const accountCurrency = await dnwalletContract.methods.getCurrency().call({from:userAccount});
    if(currency == 'USD')
    {
      newChangeCurrency[0] = amount;
      treansactionFees =  treansactionFees * 391;
      newChangeCurrency[0] = Number(accountCurrency['USD']) - (newChangeCurrency[0] + treansactionFees );
      newChangeCurrency[0] = newChangeCurrency[0].toFixed(0);
    }else if(currency == 'EGP')
    {
      newChangeCurrency[1] = amount;
      treansactionFees =  treansactionFees * 6256;
      newChangeCurrency[1] = Number(accountCurrency['EGP']) - (newChangeCurrency[1] + treansactionFees );
      newChangeCurrency[1] = newChangeCurrency[1].toFixed(0);

     
    }else if(currency == 'EUR')
    {
      newChangeCurrency[2] = amount;
      treansactionFees =  treansactionFees * 334;
      newChangeCurrency[2] = Number(accountCurrency['EUR']) - (newChangeCurrency[2] + treansactionFees );
      newChangeCurrency[2] = newChangeCurrency[2].toFixed(0);
    }else if(currency == 'JPY')
    {
      newChangeCurrency[3] = amount;
      treansactionFees =  treansactionFees * 41589;
      newChangeCurrency[3] = Number(accountCurrency['JPY']) - (newChangeCurrency[3] + treansactionFees );
      newChangeCurrency[3] = newChangeCurrency[3].toFixed(0);
    }
    
    const updataingCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(userAccount,newChangeCurrency[0],newChangeCurrency[1],newChangeCurrency[2],newChangeCurrency[3]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(mainAccount);
    const txObject = 
    {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(8000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: contractAddress,
        data: updataingCurrencyFunctionData
    }
    const tx = new Tx(txObject,{'chain':'rinkeby'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const txHash = web3.eth.sendSignedTransaction(raw);
  }

const updatingCharityCurrency = async (ToAddress, amount, currency) => {
  var newChangeCurrency = [0, 0, 0, 0];
  const accountCurrency = await dnwalletContract.methods.getCurrency().call({ from: ToAddress });
  if (currency == 'USD') {
    newChangeCurrency[0] = amount;
    newChangeCurrency[0] = Number(accountCurrency['USD']) + (newChangeCurrency[0]);
    newChangeCurrency[0] = newChangeCurrency[0].toFixed(0);
  } else if (currency == 'EGP') {
    newChangeCurrency[1] = amount;
    newChangeCurrency[1] = Number(accountCurrency['EGP']) + (newChangeCurrency[1]);
    newChangeCurrency[1] = newChangeCurrency[1].toFixed(0);


  } else if (currency == 'EUR') {
    newChangeCurrency[2] = amount;
    newChangeCurrency[2] = Number(accountCurrency['EUR']) + (newChangeCurrency[2]);
    newChangeCurrency[2] = newChangeCurrency[2].toFixed(0);
  } else if (currency == 'JPY') {
    newChangeCurrency[3] = amount;
    newChangeCurrency[3] = Number(accountCurrency['JPY']) + (newChangeCurrency[3]);
    newChangeCurrency[3] = newChangeCurrency[3].toFixed(0);
  }

  const updatingCurrencyFunctionData = dnwalletContract.methods.changeCurrencies(ToAddress, newChangeCurrency[0], newChangeCurrency[1], newChangeCurrency[2], newChangeCurrency[3]).encodeABI();
  const txCount = await web3.eth.getTransactionCount(mainAccount);
  const txObject =
  {
    nonce: web3.utils.toHex(txCount + 1),
    gasLimit: web3.utils.toHex(8000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    to: contractAddress,
    data: updatingCurrencyFunctionData
  }
  const tx = new Tx(txObject, { 'chain': 'rinkeby' });
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  const raw = '0x' + serializedTx.toString('hex');
  const txHash = web3.eth.sendSignedTransaction(raw);
}


module.exports = donate;