require('../../startup/db')();
const { User } = require('../../models/user');
const { Heir } = require('../../models/heir');


async function excuteWill() {
   
    const users = await User.find();
    users.forEach(async user => {
        if(user.willIsActive){

            const heir = await Heir.findOne({ accOwner: user.email });
            const days = (Date.now() - user.lastActive) / (1000 * 3600 * 24);
            
            const heir1 = await User.findOne({ email: heir.heir1 });
            const heir2 = await User.findOne({ email: heir.heir2 });
            
            const heir1Precentage = heir.heir1Precentage;
            const heir2Precentage = heir.heir2Precentage;

            // Get Account Owner Balance;
            
            let heir1Amount = [];
            let heir2Amount = [];
            
            if(days >= 90){
                
                // call Transfare function here twice 
                // transfar(accOwner, heir.heir1, amount)
                // transfar(accOwner, heir.heir2, amount)
            }
        }
    });
  
}

// function calcAmount()

excuteWill();