const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("x_access_token");
    if (!token)
      return res.status(403).json({
        status: "Failed !",
        message: " No x_access_token Provided",
        data: null,
      });
    const decoded = jwt.verify(token, process.env.appsecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      status: "Failed !",
      message: " Invalid token",
      data: null,
    });
  }
};
