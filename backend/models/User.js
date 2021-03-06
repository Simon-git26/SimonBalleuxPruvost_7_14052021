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
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "",
      },

      lastName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "",
      },

      email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        defaultValue: "",
        unique: true
      },

      password: {
        type: Sequelize.STRING(124),
        allowNull: false,
        defaultValue: "",
      },

      description: {
        type: Sequelize.STRING(124),
        defaultValue: "",
      },

      imagePath: {
        type: Sequelize.STRING(250),
        allowNull: false,
        defaultValue: "",
      },

      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },

    {
      //Indiquez le nom de la table dans mysql
      tableName: "users",
    }
  );

  return User;
};
