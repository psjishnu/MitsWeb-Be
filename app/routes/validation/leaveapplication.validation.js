const Joi = require("joi");

let deleteSchema = Joi.object({
  deleteId: Joi.string().required(),
});

let createSchema = Joi.object({
  toDate: Joi.string().required(),
  fromDate: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  fromTimestamp: Joi.string().required(),
  toTimestamp: Joi.string().required(),
});
let editSchema = Joi.object({
  fromTimestamp: Joi.string().required(),
  toTimestamp: Joi.string().required(),
  toDate: Joi.string().required(),
  fromDate: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
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
