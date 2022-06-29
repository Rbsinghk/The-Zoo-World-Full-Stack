const jwt = require("jsonwebtoken");
const register = require('../models/user');

const userAccess = ['/get', '/animal/getAll', '/feedback/create', '/booking/bookinTicket', '/profile/emailCode', '/profile/changePass'];

const verifytoken = async function checkUserOrAdmin(req, res, next) {
  try {
    const token = req.headers['auth-token'];
    const verifyUser = jwt.verify(token, process.env.TOKEN_CODE);
    const user = await register.findOne({ _id: verifyUser._id });
    if (user.isAdmin === true) {
      next();
    }
    else {
      if (userAccess.indexOf(req.path) != -1) {
        next();
      } else {
        res.json({
          message: "Invalid Role Only Admin can Access This"
        })
      }
    }
    req.token = token;
    req.user = user;
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
}

module.exports = verifytoken;