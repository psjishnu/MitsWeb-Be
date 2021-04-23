const Joi = require("joi");

const createExamTypeScheme = Joi.object({
  type: Joi.string().required(),
  maxMark: Joi.number().required(),
  passMark: Joi.number().required(),
});

const validateExamTypeCreation = (req, res, next) => {
  const { error } = createExamTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = { validateExamTypeCreation };
