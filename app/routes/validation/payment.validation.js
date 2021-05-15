const Joi = require("joi");

const createPayTypeScheme = Joi.object({
  type: Joi.string().required(),
  amount: Joi.number().required(),
  dueDate: Joi.string().required(),
});

const validatePayTypeCreation = (req, res, next) => {
  const { error } = createPayTypeScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validatePayTypeCreation,
};
