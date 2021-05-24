module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      firstName: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: "",
      },

      lastName: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: "",
      },

      email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        defaultValue: "",
      },

      password: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      //Indiquez le nom de la table dans mysql
      tableName: "users",
    }
  );

  return User;
};
