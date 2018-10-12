var Joi = require('joi');

module.exports = {
    body: {
        userId: Joi.number().required(),
    }


};