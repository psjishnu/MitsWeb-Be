const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("mitsweb-access-token");

  if (!token) return res.status(400).json({ msg: "Access denied " });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

module.exports = {
  auth,
};
