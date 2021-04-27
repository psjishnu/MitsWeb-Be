const Joi = require("joi");

const createExamTypeScheme = Joi.object({
  type: Joi.string().required(),
  maxMark: Joi.number().required(),
  passMark: Joi.number().required(),
});

const createExamScheme = Joi.object({
  examType: Joi.required(),
  subject: Joi.required(),
  date: Joi.required(),
  numberOfQuestions: Joi.number().required(),
  startTimestamp: Joi.required(),
  endTimestamp: Joi.required(),
});

const editExamTypeScheme = Joi.object({
  _id: Joi.string().required(),
  type: Joi.string().required(),
  maxMark: Joi.number().required(),
  passMark: Joi.number().required(),
});

const getSubjectExamsScheme = Joi.object({
  department: Joi.string().required(),
  semester: Joi.string().required(),
});

const validateExamTypeCreation = (req, res, next) => {
  const { error } = createExamTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateExamCreation = (req, res, next) => {
  const { error } = createExamScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateExamtypeEdit = (req, res, next) => {
  const { error } = editExamTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateGetSubjectExams = (req, res, next) => {
  const { error } = getSubjectExamsScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateExamTypeCreation,
  validateExamtypeEdit,
  validateExamCreation,
  validateGetSubjectExams,
};
