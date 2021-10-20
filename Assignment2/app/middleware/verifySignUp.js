const db = require("../models")
const User = db.user;
const cookieParser = require('cookie-parser');
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

checkDuplicateEmail = (req, res, next) => {
    //console.log(req.body.email);
    User.findOne({
        where: {
          user_email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Failed! Email is already in use!"
          });
          return;
        }
  
        next();
      });
};



const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail
};
  
module.exports = verifySignUp;