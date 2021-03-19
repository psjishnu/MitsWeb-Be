const Joi = require("joi");

let updateSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string(),
  id: Joi.string().required(),
  mobile: Joi.number().required(),
});

let deleteSchema = Joi.object({
  deleteId: Joi.string().required(),
});
const validateDeletion = (req, res, next) => {
  const { error, value } = deleteSchema.validate(req.body);
  error ? res.json({ msg: error, success: false }) : next();
};

const validateUpdation = (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  error ? res.json({ msg: error, success: false }) : next();
};

module.exports = {
  validateUpdation,
  validateDeletion,
};
