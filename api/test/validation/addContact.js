var Joi = require('joi');

module.exports = {
    body: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        mobile_number: Joi.string().length(10).required(),
    }
};