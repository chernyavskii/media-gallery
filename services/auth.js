'use strict'
var Promise = require('bluebird');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dqwyh00ko',
    api_key: '555347494698456',
    api_secret: 'zKPb5I5_Dwb9Pr1BYTCgAnOlw90'
});

module.exports = (userRepository, roleRepository, userRoleRepository,errors) => {
    const user_permissions = {
        '/users/profile':       'user',
        '/users/profile/':      'user',
        '/users/user/:id':      'user',
        '/posts':               'user',
        '/posts/':              'user',
        '/posts/create':        'user',
        '/posts/create/':       'user',
        '/posts/post/:id':      'user',
        '/posts/uservideo':     'user',
        '/posts/uservideo/':    'user',
        '/posts/useraudio':     'user',
        '/posts/useraudio/':    'user',
        '/posts/userimages':    'user',
        '/posts/userimages/':   'user',
        '/posts/destroy/:id':   'user',
        '/posts/audio/':        'user',
        '/posts/audio':         'user',
        '/posts/video':         'user',
        '/posts/video/':        'user',
        '/posts/images':        'user',
        '/posts/images/':       'user',
        '/posts/like/:id':      'user',
        '/posts/correct/:id':   'user',
        '/posts/search/':       'user',
        '/posts/search':        'user',
        '/posts/:id':           'user',

        '/users/admin/':        'administrator',
        '/users/admin':         'administrator',
        '/users/destroy/:id':   'administrator',
        '/users/block/:id':     'administrator'
    };
    return {
        register: register,
        login: login,
        checkPermissions: checkPermissions
    };

    function register(data, media) {
        return new Promise((resolve, reject) => {
            console.log(media);
            if (data == null || data == "" || data.email == null ||
                data.email == "" || data.password == null || data.password == "" ||
                data.firstname == null || data.firstname == "" || data.lastname == null
                || data.lastname == "" || media ==null || media == "") {
                reject(errors.emptyData);
                return;
            }
            if (data == undefined || data.email == undefined || data.password == undefined) {
                reject(errors.undefinedData);
                return;
            }
            if(data.password.length < 6)
            {
                reject(errors.validPassword);
                return;
            }
            cloudinary.uploader.upload(media, function (result) {
                let user = {
                    email: data.email,
                    password: data.password,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    image: result.url,
                    image_id: result.public_id
                };
                userRepository.create(user)
                    .then((new_user) => {
                        let userRole = {
                            roleId: 2,
                            userId: new_user.dataValues.id
                        };
                        userRoleRepository.create(userRole)
                            .then((role) =>
                            {
                                resolve(role)
                            })
                            .catch(reject)
                        resolve(new_user);
                    })
                    .catch(reject);
            });
        })
    };

    function login(data) {
        return new Promise((resolve, reject) => {
            if (data == null || data == "" || data.email == null || data.email == "" || data.password == null || data.password == "") {
                reject(errors.emptyData);
                return;
            }
            if (data == undefined || data.email == undefined || data.password == undefined) {
                reject(errors.undefinedData);
                return;
            }
            userRepository.findOne({ where: { email: data.email }, attributes: ['id', 'password','status'] })
                .then((user) => {
                    if (user == null || user.password !== data.password) {
                        reject(errors.wrongCredentials);
                        return;
                    }
                    if (user.status == 1)
                    {
                        reject(errors.userBlocked);
                        return;
                    }
                    userRoleRepository.findOne({ where: { userId: user.id },attributes: ['userId', 'roleId'] })
                        .then((result) =>
                        {
                            let result_user = {
                                id: user.id,
                                roleId: result.roleId
                            }
                            resolve(result_user);
                        })
                        .catch(reject)
                })
                .catch(reject);
        });
    };

    function checkPermissions(userId, route) {
        return new Promise((resolve, reject) => {
            if(user_permissions[route] == undefined)
                resolve();
            else
                if (userId == undefined)
                    reject();
            else {
                    Promise.all([userRepository.findById(userId), roleRepository.findOne({where: {name: user_permissions[route]}})])
                        .spread((user, role) => {
                            return user.hasRole(role);
                        })
                        .then((has) => {
                            if (has) resolve();
                            else reject();
                        })
                        .catch(reject)
            }
        });
    };
};

