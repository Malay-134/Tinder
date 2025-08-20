const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decoded = jwt.verify(token, "h8*wbh$@ef#kh87kk*$#&jkKB3FNn");
    const { _id } = decoded;
    // console.log(_id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user
    next();
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
};

module.exports = {
  userAuth,
};
