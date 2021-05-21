const Joi = require("joi");

const createFeedbackTypeScheme = Joi.object({
  category: Joi.string().required(),
});
const updateFeedbackTypeScheme = Joi.object({
  category: Joi.string().required(),
  _id: Joi.string().required(),
});

const validateaddFeedbackType = (req, res, next) => {
  const { error } = createFeedbackTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};
const validateupdateFeedbackType = (req, res, next) => {
  const { error } = updateFeedbackTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateaddFeedbackType,
  validateupdateFeedbackType,
};
