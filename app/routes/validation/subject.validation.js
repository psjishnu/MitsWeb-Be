const Joi = require("joi");

let createSubjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  courseType: Joi.string().required(),
  department: Joi.string().required(),
  semester: Joi.number().required(),
});

const validateSubjectCreation = (req, res, next) => {
  const { error } = createSubjectSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateSubjectCreation,
};
