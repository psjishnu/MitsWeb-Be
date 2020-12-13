const Joi = require("joi");

let signupScheme = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  pic: Joi.string(),
});

let loginScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateRegistration = (req, res, next) => {
  const { error, value } = signupScheme.validate(req.body);
  error ? res.json({ msg: error }) : next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginScheme.validate(req.body);
  error ? res.json({ msg: error }) : next();
};

module.exports = {
  validateRegistration,
  validateLogin,
};
