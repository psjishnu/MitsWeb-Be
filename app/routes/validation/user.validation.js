const Joi = require("joi");

let updateScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.any(),
  confirm: Joi.any(),
  number: Joi.number().required(),
  parentDetails: Joi.object().required(),
  address: Joi.string().required(),
  dob: Joi.string().required(),
  bloodGroup: Joi.string().required(),
});

const validateUpdate = (req, res, next) => {
  const { error, value } = updateScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = { validateUpdate };
