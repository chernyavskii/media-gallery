module.exports = (Sequelize, sequelize) => {
    return sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        description:    Sequelize.STRING,
        title:          Sequelize.STRING,
        type:           Sequelize.STRING,
        image:          Sequelize.STRING,
        image_id:       Sequelize.STRING,
        likes:          Sequelize.INTEGER

    });
};