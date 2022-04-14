const jwt = require("jsonwebtoken")
const config = require("config")

module.exports = function(req, res, next) {

  // GET TOKEN FROM SERVER
  const token = req.header("x-auth-token");

  //CHECK IF EXISTS
  if(!token){
    return res.status(401).json({ msg: "No token authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jswSecret"));

    req.user = decoded.user;
    next();

  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }

}