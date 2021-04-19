const generateStudentId = (rollNo, department, passoutYear) => {
  var finalrollNo = "None",
    zeros = "";
  for (var i = 0; i < 3 - String(Number(rollNo)).length; i++) {
    zeros += "0";
  }
  finalrollNo =
    Number(passoutYear) -
    4 -
    2000 +
    department.substr(0, 2) +
    zeros +
    Number(rollNo);

  return finalrollNo;
};

module.exports = {
  generateStudentId,
};
