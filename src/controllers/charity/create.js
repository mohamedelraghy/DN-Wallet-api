var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c43e1f8e5434b2ab24b6b1bcbad393b');


const { Charity, validate } = require('../../models/charity_org');
const _ = require('lodash');
const formidable = require('formidable');
const cloudinaryUpload = require('../../services/cloudinary');

async function create(req, res){
    const form = new formidable.IncomingForm();
    form.parse(req, async (formError, fields, files) => {
        if(formError){
            console.error(formError);
            return res.status(400).json({ "error": formError });
        }
        req.body = fields;

        const { error } = validate(req.body);
        if (error) return res.status(400).json({ "error": error.details[0].message });

        let charity = new Charity(_.pick(req.body, ['name', 'address', 'founders', 'vision', 'about', 'email', 'phone']));
        
        const location = {
            lat : req.body.lat,
            lan : req.body.lan
        }
        
        charity.location = location;
        
        if(files.logo){

            const {secure_url, err} = await cloudinaryUpload(files.logo.path);
            if(err) {
                console.error(err);
                return res.status(400).json(err);
            }
            charity.org_logo = secure_url;
        }

        if(files.image) {
            const {secure_url, err} = await cloudinaryUpload(files.image.path);
            if(err) {
                console.error(err);
                return res.status(400).json({ "error" : err });
            }
            charity.org_image = secure_url;
        }
        
        charity.donation_number = 0;


        const newCharity = await web3.eth.accounts.create();
        const jsonForCharity = await web3.eth.accounts.encrypt(newCharity['privateKey'],'charity'); // Must save 
        const publicKey = newCharity['address']; //Must save
        
        charity.publicKey = publicKey;
        charity.cryptedAcc = jsonForCharity;

        await charity.save()
        res.status(200).json(charity)
    });
}
module.exports = create;