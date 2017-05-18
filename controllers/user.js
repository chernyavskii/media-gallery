'use strict'
var express = require('express');
var jwt = require('jsonwebtoken');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dqwyh00ko',
    api_key: '555347494698456',
    api_secret: 'zKPb5I5_Dwb9Pr1BYTCgAnOlw90'
});
module.exports = (userService, config, errors) => {
    const router = express.Router();

    function getUserId(cookie) {
        var verifiedJwt = jwt.verify(cookie, config.cookie.key);
        var userId = verifiedJwt.__user_id;
        return userId;
    }

    router.get('/profile', (req, res) => {
        var userId = getUserId(req.cookies['x-access-token']);
        userService.getProfile(userId)
            .then((post) => res.render('pages/profile',{ref_path:req.url,post:post,image: cloudinary.image, image_url: cloudinary.url}))
            .catch((err) => res.error(err));
    });

    router.get('/user/:id', (req, res) => {
        userService.getProfile(req.params.id)
            .then((post) => res.render('pages/get_user',{ref_path:req.url,post:post,image: cloudinary.image, image_url: cloudinary.url}))
            .catch((err) => res.error(err));
    });

    router.get('/admin', (req, res) => {
        userService.getAllUsers()
            .then((user) => {
                let err = {
                    message: '',
                    code: '',
                    status: ''
                };
                res.render('pages/admin_panel', {user: user, err: err})
            })
            .catch((err) => res.error(err));
    });

    router.get('/destroy/:id',(req,res) =>{
        var userId = getUserId(req.cookies['x-access-token']);
        userService.deleteProfile(userId, req.params.id)
            .then((post) => {res.redirect(req.headers.referer)})
            .catch((err) =>  res.redirect(req.headers.referer));
    });

    router.post('/block/:id',(req,res) =>{
        var userId = getUserId(req.cookies['x-access-token']);
        userService.blockProfile(userId, req.params.id)
            .then((post) => {res.redirect(req.headers.referer)
            })
            .catch((err) =>  res.redirect(req.headers.referer));
    });

    return router;
};