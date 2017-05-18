'use strict'

module.exports = (userRepository, userRoleRepository, postRepository, errors) => {
    return {
        getProfile: getProfile,
        deleteProfile: deleteProfile,
        getAllUsers: getAllUsers,
        blockProfile: blockProfile
    };

    function getProfile(userId) {
        return new Promise((resolve, reject) => {
            userRepository.findById(userId,{include: [{ model: postRepository, required: true}]})
                .then((user) =>
                {
                    if(user == null) {
                        userRepository.findById(userId)
                            .then((new_user) => {
                                let get_user = {
                                    id: new_user.dataValues.id,
                                    email: new_user.dataValues.email,
                                    password: new_user.dataValues.password,
                                    firstname: new_user.dataValues.firstname,
                                    lastname: new_user.dataValues.lastname,
                                    image: new_user.dataValues.image,
                                    image_id: new_user.dataValues.image_id,
                                    count_posts: 0,
                                    createdAt: new_user.dataValues.createdAt
                                };
                                resolve(get_user);
                            })
                            .catch(reject)
                    }
                    else {
                        postRepository.findAndCountAll({where: {userId: userId}})
                            .then((count) => {
                                let get_user = {
                                    id: user.dataValues.id,
                                    email: user.dataValues.email,
                                    password: user.dataValues.password,
                                    firstname: user.dataValues.firstname,
                                    lastname: user.dataValues.lastname,
                                    image: user.dataValues.image,
                                    image_id: user.dataValues.image_id,
                                    count_posts: count.count,
                                    createdAt: user.dataValues.createdAt
                                }
                                resolve(get_user);
                            })
                    }})
                .catch(reject)
        });
    }

    function getAllUsers() {
        return new Promise((resolve, reject) => {
            userRepository.findAll()
                .then((user) => resolve(user))
                .catch(reject)
        });
    }

    function deleteProfile(idSession, id) {
        return new Promise((resolve, reject) => {
            if (idSession == id) {
                reject(errors.deleteAdmin);
                return;
            }
            Promise.all([userRepository.destroy({where: {id: id}}),
                userRoleRepository.destroy({where: {userId: id}}),
                postRepository.destroy({where: {userId: id}})])
                .then((result) => resolve({Success:true}))
                .catch(reject);
        })
    }

    function blockProfile(idSession, id) {
        return new Promise((resolve, reject) => {
            if (idSession == id) {
                reject(errors.blockAdmin);
                return;
            }
            let status_ = {
                value1: 0,
                value2: 1
            }
            userRepository.findOne({where:{id: id },attributes: ['id', 'status'] })
                .then((user) =>
                {
                    if(user.dataValues.status === 0)
                    {
                        userRepository.update({status: status_.value2},{where: {id: id}, limit:1})
                            .then((result) => resolve({Success:true}))
                            .catch(reject)
                    }
                    else
                    {
                        userRepository.update({status: status_.value1},{where: {id: id}, limit:1})
                            .then((result) => resolve({Success:true}))
                            .catch(reject)
                    }
                })
                .catch(reject)
        })
    }

}



