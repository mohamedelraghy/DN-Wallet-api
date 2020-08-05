const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');
const contractAdress = '0xfea5f0A6617fF11436252894FE6cF7ace96c296E'
const abi = [{ "constant": false, "inputs": [{ "name": "client", "type": "address" }, { "name": "uSd", "type": "uint256" }, { "name": "eGp", "type": "uint256" }, { "name": "eUr", "type": "uint256" }, { "name": "jPy", "type": "uint256" }], "name": "changeCurrencies", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "currency", "type": "string" }], "name": "transferTo", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrency", "outputs": [{ "components": [{ "name": "USD", "type": "uint256" }, { "name": "EGP", "type": "uint256" }, { "name": "EUR", "type": "uint256" }, { "name": "JPY", "type": "uint256" }], "name": "", "type": "tuple" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getHistory", "outputs": [{ "components": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "transactionCurrency", "type": "string" }], "name": "", "type": "tuple[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];
var dnwalletContract = new web3.eth.Contract(abi,contractAdress);
const { User } = require('../../models/user');
const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;

async function getBalance (req, res) {

    
    const CharityID = req.params.CharityID;
    let currentBalance;

    if(CharityID){
        if (!ObjectId.isValid(CharityID)) return res.status(400).json({ "error": "Invalid ID" });
        
        const charity = await Charity.findById(CharityID).select('cards cryptedAcc publicKey');
        if(!charity) return res.status(400).json({ "error": "Charity with the given ID is not found" });

        currentBalance = await dnwalletContract.methods.getCurrency().call({ from: charity.publicKey });//JSON For balance
        if (!currentBalance) return res.status(400).json({ "error": "cannot show balance" });

    }


    const user = await User.findById(req.user._id).select('cards cryptedAcc publicKey email');
    if(!user) return res.status(400).json({ "error" : "User with the Given ID is not found" });
  
    currentBalance = await dnwalletContract.methods.getCurrency().call({ from: user.publicKey });//JSON For balance
    if(!currentBalance) return res.status(400).json({ "error": "cannot show balance" });

    const curr = ['EGP', 'USD', 'EUR', 'JPY'];
    const result =[];
    
    curr.forEach(ele => {
        const balance = {
            amount: currentBalance[ele],
            currency_code: ele
        }
        result.unshift(balance);
    });
   
    
    return res.status(200).send(result);

}

module.exports = getBalance;