const Joi = require('joi');

async function heir(req, res) {

    

}

function validate(req){
    
    const schema = {
        first_user: Joi.string().min(5).max(255).required().email(),
        second_user: Joi.string().min(5).max(255).required().email(),
        precentage : Joi.number().positive().required()
    }
    return Joi.validate(req, schema);
}

module.exports   = heir;