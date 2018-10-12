var Joi = require('joi');

module.exports = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
        name: Joi.string().required(),
        mobile_number: Joi.string().length(10).required(),

    }
};