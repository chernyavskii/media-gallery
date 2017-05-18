'use strict'
var jwt = require('jsonwebtoken');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dqwyh00ko',
    api_key: '555347494698456',
    api_secret: 'zKPb5I5_Dwb9Pr1BYTCgAnOlw90'
});

module.exports = (postRepository,userRepository,likeRepository, errors) => {
    return {
        getById: getById,
        getAll: getAll,
        deleteById: deleteById,
        newPost: newPost,
        getAllAudio: getAllAudio,
        getAllVideo: getAllVideo,
        getAllImages: getAllImages,
        getAllUserImages: getAllUserImages,
        getAllUserAudio: getAllUserAudio,
        getAllUserVideo: getAllUserVideo,
        updatePost: updatePost,
        likePost: likePost,
        searchPost: searchPost
    };

    function newPost(userId,post,media,media_type) {
        var type = {
            value1: "video",
            value2: "image",
            value3: "audio"
        };
        var split_media = JSON.stringify({value_type :media_type.split("/")});
        var value_parse = JSON.parse(split_media);
        var equal_type = value_parse.value_type[0];
        if(equal_type == type.value1)
        {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(media, function (result) {
                        let new_post = {
                            userId: userId,
                            title: post.title,
                            description: post.description,
                            image: result.url,
                            image_id: result.public_id,
                            type: result.resource_type
                        };
                        postRepository.create(new_post)
                            .then(() => resolve(new_post))
                            .catch(reject)
                    },
                    {
                        resource_type: type.value1
                    }
                )})
        }
        if(equal_type == type.value2)
        {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(media, function (result) {
                        let new_post = {
                            userId: userId,
                            title: post.title,
                            description: post.description,
                            image: result.url,
                            image_id: result.public_id,
                            type: result.resource_type
                        };
                        postRepository.create(new_post)
                            .then(() => resolve(new_post))
                            .catch(reject)
                    },
                    {
                        resource_type: type.value2
                    }
                )})
        }
        if(equal_type == type.value3)
        {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(media, function (result) {
                        let new_post = {
                            userId: userId,
                            title: post.title,
                            description: post.description,
                            image: result.url,
                            image_id: result.public_id,
                            type: equal_type
                        };
                        postRepository.create(new_post)
                            .then(() => resolve(new_post))
                            .catch(reject)
                    },
                    {
                        resource_type: type.value1
                    }
                )})
        }

    };

    function getById(id) {
        return new Promise((resolve, reject) => {
            if (id == null || id == "") {
                reject(errors.emptyData);
                return;
            }
            if (id == undefined) {
                reject(errors.undefinedData);
                return;
            }
            postRepository.findById(id, {include: [{model: userRepository, required: true}]})
                .then((post) => {
                    if (post == null) {
                        reject(errors.undefinedData)
                        return;
                    }
                    else {
                        let postById = {
                            id: post.dataValues.id,
                            description: post.dataValues.description,
                            title: post.dataValues.title,
                            image: post.dataValues.image,
                            type: post.dataValues.type,
                            image_id: post.dataValues.image_id,
                            likes: post.dataValues.likes,
                            createdAt: post.dataValues.createdAt,
                            updatedAt: post.dataValues.updatedAt,
                            userId: post.dataValues.userId,
                            email: post.user.dataValues.email,
                            image_id_user: post.user.dataValues.image_id,
                            image_user: post.user.dataValues.image
                        };
                        resolve(postById);
                    }
                })
                .catch(reject);
        });
    }

    function getAll() {
        return new Promise((resolve, reject) => {
            postRepository.findAll({include: [{ model: userRepository, required: true}]})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function deleteById(id) {
        return new Promise((resolve, reject) => {
            if(id == null || id == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(id == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            postRepository.destroy({where : {id : id}})
                .then((result) => resolve({Success:true}))
                .catch(reject);
        });
    }

    function getAllAudio() {
        return new Promise((resolve, reject) => {
            postRepository.findAll({where: {type:'audio'},include:[{ model: userRepository, required: true}]})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function getAllVideo() {
        return new Promise((resolve, reject) => {
            postRepository.findAll({where: {type:'video'},include:[{ model: userRepository, required: true}]})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function getAllImages() {
        return new Promise((resolve, reject) => {
            postRepository.findAll({where: {type:'image'},include:[{ model: userRepository, required: true}]})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function getAllUserImages(userId) {
        return new Promise((resolve, reject) => {
            if(userId == null || userId == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(userId == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            postRepository.findAll({where:{type:'image',userId:userId}})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function getAllUserAudio(userId) {
        return new Promise((resolve, reject) => {
            if(userId == null || userId == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(userId == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            postRepository.findAll({where:{type:'audio',userId:userId}})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function getAllUserVideo(userId) {
        return new Promise((resolve, reject) => {
            if(userId == null || userId == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(userId == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            postRepository.findAll({where:{type:'video',userId:userId}})
                .then((post) => resolve(post))
                .catch(reject)
        });
    }

    function updatePost(id,data) {
        return new Promise((resolve, reject) => {
            if(id == null || id == "" || data == null || data == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(id == undefined || data == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            let new_data = {
                title: data.title,
                description: data.description
            };
            postRepository.update(new_data, {where: {id: id}, limit: 1})
                .then(() => resolve({Success:true}))
                .catch(reject);
        });
    }

    function likePost(userId,postId) {
        return new Promise((resolve, reject) => {
            if(userId == null || userId == "" || postId == null || postId == "")
            {
                reject(errors.emptyData);
                return;
            }
            if(userId == undefined || postId == undefined)
            {
                reject(errors.undefinedData);
                return;
            }
            likeRepository.findOne({ where: { userId: userId, postId: postId }, attributes: ['id'] })
                .then((result) =>
                {
                    if(result == null)
                    {
                        postRepository.findById(postId)
                            .then((post_find) => {
                                let user_likes = post_find.dataValues.likes;
                                postRepository.update({likes: user_likes + 1}, {where: {id: postId}, limit: 1})
                                let new_like = {
                                    userId: userId,
                                    postId: postId
                                };
                                likeRepository.create(new_like)
                                    .then((res) => resolve(res))
                                    .catch(reject)
                            })
                    }
                    else
                    {
                        postRepository.findById(postId)
                            .then((post_find) => {
                                let user_likes = post_find.dataValues.likes;

                                postRepository.update({likes: user_likes - 1}, {where: {id: postId}, limit: 1})
                                    .then((new_post) => resolve(new_post))
                                    .catch(reject);

                                likeRepository.findOne({ where: { userId: userId, postId: postId }, attributes: ['id'] })
                                    .then((id) => {
                                        likeRepository.destroy({where : {id : id.dataValues.id}})
                                            .then((destr) => resolve(destr))
                                            .catch(reject)
                                    })
                                    .catch(reject);
                            })
                    }
                })
                .catch(reject)
        });
    }

    function searchPost(word) {
            return new Promise((resolve,reject) => {
                if (word == null || word == "" ) {
                    reject(errors.emptyData);
                    return;
                };
                if (word == undefined ) {
                    reject(errors.undefinedData);
                    return;
                };
                postRepository.findAll({
                where: {
                    $or: [{
                        title: {
                            $like: '%' + word + '%'
                        }
                    }]
                },include:[{ model: userRepository, required: true}]})
                .then((result) => resolve(result))
                .catch(reject)
        })
    }

};


