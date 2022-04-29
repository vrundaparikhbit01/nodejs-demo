module.exports = (sequelize, Sequelize) => {
  const UserProject = sequelize.define("user_projects", {
    project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'project',
          key: 'id'
        }
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
  return UserProject;
};