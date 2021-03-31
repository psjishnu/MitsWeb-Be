const Joi = require("joi");

let deleteSchema = Joi.object({
  deleteId: Joi.string().required(),
});

let createSchema = Joi.object({
  onTime: Joi.string().required(),
  onDate: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
});
let editSchema = Joi.object({
  onTime: Joi.string().required(),
  onDate: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  _id: Joi.string().required(),
});

const validateDeletion = (req, res, next) => {
  const { error, value } = deleteSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validateEdit = (req, res, next) => {
  const { error, value } = editSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validateCreation = (req, res, next) => {
  const { error, value } = createSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateDeletion: validateDeletion,
  validateCreation: validateCreation,
  validateEdit: validateEdit,
};
