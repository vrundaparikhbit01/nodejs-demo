module.exports = app => {
  var router = require("express").Router();
  const users = require("../controllers/user.controller.js");
  router.post("/register", users.register);
  router.post("/addUserProject", users.addUserProject);
  router.post("/oneToOne", users.oneToOne);
  router.post("/oneToMany", users.oneToMany);
  router.post("/ManyToMany", users.ManyToMany);
  app.use('/api', router);
};