const Joi = require("joi");

const createFeedbackTypeScheme = Joi.object({
  category: Joi.string().required(),
});
const updateFeedbackTypeScheme = Joi.object({
  category: Joi.string().required(),
  _id: Joi.string().required(),
});

const getQuestionsScheme = Joi.object({
  faculty: Joi.string().required(),
});

const questionValidationScheme = Joi.object({
  category: Joi.string().required(),
  questions: Joi.any().required(),
}

)
const postFeedbackScheme = Joi.object({
  questionSet: Joi.string().required(),
  faculty: Joi.string().required(),
  feedback: Joi.any().required(),
});

const validateaddFeedbackType = (req, res, next) => {
  const { error } = createFeedbackTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validateGetquestions = (req, res, next) => {
  const { error } = getQuestionsScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validateupdateFeedbackType = (req, res, next) => {
  const { error } = updateFeedbackTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validatepostFeedback = (req, res, next) => {
  const { error } = postFeedbackScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validatequestionFeedbackType = (req, res, next) => {
  const { error } = questionValidationScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateaddFeedbackType,
  validateupdateFeedbackType,
  validateGetquestions,
  validatepostFeedback,
  validatequestionFeedbackType,
};
