const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

const forschema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  otp: Joi.required(),
});

module.exports = { schema, forschema };
