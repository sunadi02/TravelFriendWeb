const Joi = require("joi");

// User validation schema
const userValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(6).required(),
        first_name: Joi.string().min(1).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
        phone_number: Joi.string().length(10).pattern(/^\d+$/).required(),
    });
    return schema.validate(data);
};

module.exports = { userValidation };
