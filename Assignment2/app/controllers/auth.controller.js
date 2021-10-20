const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const cookieParser = require('cookie-parser')

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
  // Save User to Database
  const user = await User.create({
    user_name: req.body.username,
    user_email: req.body.email,
    user_password: bcrypt.hashSync(req.body.password, 8),
    // image_type: req.file.mimetype,
    // image_name: req.file.originalname,
    // user_image: req.file.buffer, 
  })
  res.redirect("/");
};

exports.update = async(req,res) => {
  username = null;
  email = null;
  password = null;
  user_id = req.cookies['user_id'];
  console.log(user_id);
  if(req.body.username){
    const user = await User.findOne({
      where: {
        user_name: req.body.username
      }
    });
    const user1 = await User.findOne({
      where: {
        id: user_id
      }
    });
    console.log(user);
    if(!user || user1){
        username = req.body.email
        const updation = await User.update(
          {user_name : req.body.username},
          {where: {id : user_id}}
        );
    }
    else{
      res.status(400).send({message: "Username Already Exists..."});
    }
  }
  if(req.body.email){
    const user = await User.findOne({
      where: {
        user_email: req.body.email
      }
    });
    const user1 = await User.findOne({
      where: {
        id: user_id
      }
    });
    if(!user || user1){
        email = req.body.email
        const updation = await User.update(
          {user_email : req.body.email},
          {returning: true, where: {id : user_id}}
        );
    }
    else{
      res.status(400).send({message: "Email Already Exists..."});
    }
  }
  if(req.body.password){
    password = bcrypt.hashSync(req.body.password, 8);
    const updation = await User.update(
      {password : req.body.password},
      {returning: true, where: {user_id : user_id}}
    );
  }
  res.status(200).send({message: "Information Updated Successfully"});
};

exports.delete = async(req,res) => {
  id = req.params.id;
  user_id = req.cookies['user_id'];
  User.destroy({
    where: { user_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe Customer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
}

  exports.signin = async(req, res) => {
    User.findOne({
      where: {
        user_email: req.body.email
      }
    }).then(async user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.user_password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
            res.cookie('id', token, { sameSite: 'lax', maxAge: 86400 });
            res.cookie('user_id', user.id, { sameSite: 'lax', maxAge: 86400 });
            const user_id = user.id;
            user = await User.update(
              {last_logged_in : new Date()},
              {returning: true, where: {id : user_id}}
            );
            res.redirect("/update/form");
            //console.log(req.cookies['id']);
            // res.status(200).send({
            //   id: user.user_id,
            //   username: user.user_username,
            //   email: user.user_email,
            //   accessToken: token
            // });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    };