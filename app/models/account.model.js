module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
    }    
  });
  return Account;
};