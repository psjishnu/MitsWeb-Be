const Joi = require("joi");

let updateSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string(),
  mobile: Joi.number().required(),
  active: Joi.boolean().required(),
  isHOD: Joi.boolean(),
  department: Joi.string().required(),
  advisor: Joi.object(),
  currentYear: Joi.number(),
  passoutYear: Joi.number(),
});

let deleteSchema = Joi.object({
  email: Joi.string().required().email(),
});

let addUserSchema = Joi.object({
  email: Joi.string().required().email(),
  type: Joi.string().required(),
  password: Joi.string().required(),
  department: Joi.string().required(),
  currentYear: Joi.number(),
  passoutYear: Joi.number(),
});

const validateDeletion = (req, res, next) => {
  const { error, value } = deleteSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateUpdation = (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateAddUser = (req, res, next) => {
  const { error, value } = addUserSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateUpdation,
  validateDeletion,
  validateAddUser,
};
