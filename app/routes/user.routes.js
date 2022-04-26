module.exports = app => {
  var router = require("express").Router();
  const users = require("../controllers/user.controller.js");
  router.post("/register", users.register);
  app.use('/api', router);
};