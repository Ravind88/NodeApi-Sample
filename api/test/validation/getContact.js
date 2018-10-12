var Joi = require('joi');

module.exports = {
    query: {
        userId: Joi.number().required(),
    }
    

};