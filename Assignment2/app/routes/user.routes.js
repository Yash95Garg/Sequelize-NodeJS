const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const db = require("../models");
const User = db.user;
const cookieParser = require('cookie-parser')


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get("/update", async(req,res) => {
    res.redirect('/login');
  })

  app.get("/login", async(req,res) => {
    res.render("login");
  })

  app.get("/update/form", async(req,res) => {
    res.render("update");
  })

  app.get("/insert", async(req,res) => {
    res.render("register");
  })
  
  app.get("/", async(req,res) => {
    User.findAll()
    .then(data => {
      res.render("home",{data: data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Customers."
      });
    });
  });

  app.get("/details/:id", async(req,res) => {
    User.findOne({
      where: {
        user_id: req.params.id
      }
    })
    .then(data => {
      res.render("profile",{response:data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Customers."
      });
    });
  });

};  