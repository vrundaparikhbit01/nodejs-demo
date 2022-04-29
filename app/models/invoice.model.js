module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define("invoice", {
    amount: {
      type: Sequelize.DOUBLE
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
    }    
  });
  return Invoice;
};