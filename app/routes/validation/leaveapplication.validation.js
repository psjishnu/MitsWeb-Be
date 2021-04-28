const Joi = require("joi");

let deleteSchema = Joi.object({
  deleteId: Joi.string().required(),
});

let createSchema = Joi.object({
  description: Joi.string().required(),
  fromDate: Joi.any(),
  toDate: Joi.any(),
  type: Joi.string().required(),
  fromTime: Joi.any(),
  toTime: Joi.any(),
  date: Joi.any(),
});
let editSchema = Joi.object({
  _id: Joi.string().required(),
  description: Joi.string().required(),
  fromDate: Joi.any(),
  toDate: Joi.any(),
  type: Joi.string().required(),
  fromTime: Joi.any(),
  toTime: Joi.any(),
  date: Joi.any(),
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
