const Joi = require("joi");

let getTimetableScheme = Joi.object({
  department: Joi.string().required(),
  semester: Joi.number().required(),
});

const validateGetTimetable = (req, res, next) => {
  const { error } = getTimetableScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateGetTimetable,
};
