const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.invoices = require("./invoice.model.js")(sequelize, Sequelize);
db.accounts = require("./account.model.js")(sequelize, Sequelize);
db.projects = require("./project.model.js")(sequelize, Sequelize);
db.user_projects = require("./user_project.model.js")(sequelize, Sequelize);


//oneToOne
db.users.hasOne(db.accounts, {
 	as: "account" , 
 	foreignKey: "user_id"
});
db.accounts.hasOne(db.users, {
 	as: "user" , 
 	foreignKey: "id"
});

//oneToMany
db.users.hasMany(db.invoices, {
 	as: "invoices" , 
 	foreignKey: "user_id"
});
db.invoices.belongsTo(db.users, {
  	as: "users",
  	foreignKey: "user_id",
});

//ManyToMany
db.users.belongsToMany(db.projects, { 
	as: "projects",
  	foreignKey: "user_id", 
  	through: 'user_projects'
}); 
db.projects.belongsToMany(db.users, { 
	as: "users",
  	foreignKey: "project_id",
	through: 'user_projects' 
});

module.exports = db;