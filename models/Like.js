module.exports = (Sequelize, sequelize) => {
    return sequelize.define('like', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

    });
};