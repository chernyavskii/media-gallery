module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email:      Sequelize.STRING,
        password:   Sequelize.STRING,

        firstname:  Sequelize.STRING,
        lastname:   Sequelize.STRING,
        image:      Sequelize.STRING,
        image_id:   Sequelize.STRING,
        status:     { type: Sequelize.INTEGER, defaultValue: 0}
    });
};