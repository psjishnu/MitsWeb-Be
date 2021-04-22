const Joi = require("joi");

let createSubjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  courseType: Joi.string().required(),
  department: Joi.string().required(),
  semester: Joi.number().required(),
  taughtBy: Joi.any(),
});

let editSubjectSchema = Joi.object({
  _id: Joi.any(),
  name: Joi.string(),
  code: Joi.string(),
  courseType: Joi.string(),
  department: Joi.string(),
  semester: Joi.number(),
  taughtBy: Joi.any(),
});

const validateSubjectCreation = (req, res, next) => {
  const { error } = createSubjectSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateSubjectEdit = (req, res, next) => {
  const { error } = editSubjectSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateSubjectCreation,
  validateSubjectEdit,
};
