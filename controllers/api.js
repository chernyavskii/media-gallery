const express = require('express');

module.exports = (authService, postService,userService,cacheService, config, errors) => {
    var router = express.Router();

    var authController = require('./auth')(authService, config);
    var postController = require('./posts')(postService, config);
    var userController = require('./user')(userService, config, errors);

    router.use('/auth', authController);
    router.use('/posts', postController);
    router.use('/users', userController);

    return router;
};
