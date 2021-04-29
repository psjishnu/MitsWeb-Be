const Joi = require("joi");

let studentSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  department: Joi.string().required(),
  currentYear: Joi.number().required(),
  passoutYear: Joi.number().required(),
  rollNo: Joi.number().required(),
});

const validateStudent = (body) => {
  const { error, value } = studentSchema.validate(body);
  if (error) {
    console.log(error);
    return false;
  }
  return true;
};

module.exports = { validateStudent };
