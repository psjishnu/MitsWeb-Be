const Joi = require("joi");

let gatepassScheme = Joi.object({
  gatepassId: Joi.string().required(),
});

const validateGatepass = (req, res, next) => {
  const { error, value } = gatepassScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateGatepass,
};
