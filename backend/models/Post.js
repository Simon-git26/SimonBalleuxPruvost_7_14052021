module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define(
        "Post",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            post: {
                type: Sequelize.STRING(500),
                allowNull: false,
                defaultValue: "",
            },

            imagePath: {
                type: Sequelize.STRING(250),
                allowNull: false,
                defaultValue: "",
            },
        },

        {
            //Indiquez le nom de la table dans mysql
            tableName: "posts",
        }
    );

    return Post;
};