const Joi = require("joi");

let updateSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string(),
  mobile: Joi.any(),
  active: Joi.boolean(),
  isHOD: Joi.boolean(),
  department: Joi.string(),
  advisor: Joi.object(),
  currentYear: Joi.any(),
  passoutYear: Joi.any(),
  rollNo: Joi.any(),
});

let deleteSchema = Joi.object({
  email: Joi.string().required().email(),
});

let addUsersScheme = Joi.object({
  type: Joi.string().required(),
  data: Joi.any().required(),
});

let addTimetableScheme = Joi.object({
  semesterDepartment: Joi.any().required(),
  periodTimings: Joi.any().required(),
})

let addUserSchema = Joi.object({
  email: Joi.string().required().email(),
  type: Joi.string().required(),
  password: Joi.string().required(),
  department: Joi.string().required(),
  currentYear: Joi.any(),
  passoutYear: Joi.any(),
  joiningYear: Joi.any(),
  rollNo: Joi.any(),
});

const validateDeletion = (req, res, next) => {
  const { error, value } = deleteSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateaddTimetable = (req, res, next) => {
  const { error, value } = addTimetableScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateAddUsers = (req, res, next) => {
  const { error, value } = addUsersScheme.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateUpdation = (req, res, next) => {
  const { error, value } = updateSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

const validateAddUser = (req, res, next) => {
  const { error, value } = addUserSchema.validate(req.body);
  error ? res.json({ msg: error.details[0].message, success: false }) : next();
};

module.exports = {
  validateUpdation,
  validateDeletion,
  validateAddUser,
  validateAddUsers,
  validateaddTimetable,
};
