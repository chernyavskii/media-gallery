'use strict'
module.exports = (Sequelize, config) =>
{
    const options =
        {
            host: config.db.host,
            dialect: 'mysql',
            logging: false,
            define:
                {
                    timestamps: true,
                    paranoid: true,
                    defaultScope:
                        {
                            where:
                                {
                                    deletedAt: { $eq: null }
                                }
                        }
                }
        };

    const options_pg =
        {
            host: config.production.host,
            dialect: 'postgres',
            logging: false,
            define:
                {
                    timestamps: true,
                    paranoid: true,
                    defaultScope:
                        {
                            where:
                                {
                                    deletedAt: { $eq: null }
                                }
                        }
                }
        };

    var sequelize;

    if(process.env.NODE_ENV === 'production')
    {
        sequelize = new Sequelize(config.production.name, config.production.user, config.production.password, options_pg);
    }
    else
    {
        sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);
    }

    const User = require('../models/User')(Sequelize, sequelize);
    const Post = require('../models/Post')(Sequelize, sequelize);
    const Role = require('../models/Role')(Sequelize, sequelize);
    const UserRole = require('../models/UserRole')(Sequelize, sequelize);
    const Like = require('../models/Like')(Sequelize, sequelize);

    User.belongsToMany(Role,
        { through: UserRole });

    Role.belongsToMany(User,
        { through: UserRole });

    Post.belongsTo(User);
    User.hasMany(Post);


    Like.belongsTo(User);
    Like.belongsTo(Post);

    return {
        user      : User,
        post      : Post,
        role      : Role,
        userRole  : UserRole,
        like:   Like,

        sequelize : sequelize
    };
};