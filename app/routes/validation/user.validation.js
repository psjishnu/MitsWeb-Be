const Joi = require("joi");

let updateScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.any(),
  confirm: Joi.any(),
  number: Joi.number().required(),
});

const validateUpdate = (req, res, next) => {
  const { error, value } = updateScheme.validate(req.body);
  error ? res.json({ msg: error, success: false }) : next();
};

module.exports = { validateUpdate };
