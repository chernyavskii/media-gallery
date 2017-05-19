'use strict'
var express = require('express');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dqwyh00ko',
    api_key: '555347494698456',
    api_secret: 'zKPb5I5_Dwb9Pr1BYTCgAnOlw90'
});

module.exports = (postService, config) => {

    const router = express.Router();

    function getUserId(cookie) {
        var verifiedJwt = jwt.verify(cookie, config.cookie.key);
        var userId = verifiedJwt.__user_id;
        return userId;
    }

    router.post('/create', multipartMiddleware, (req, res) =>{
        var userId = getUserId(req.cookies['x-access-token']);
        postService.newPost(userId,req.body,req.files.image.path,req.files.image.type)
            .then((post) => res.redirect(req.headers.referer))
            .catch((err) => res.error(err));
    });

    router.get('/post/:id', (req, res) => {
        let get_url = {val: req.originalUrl}
        postService.getById(req.params.id)
            .then((post) => res.render('pages/post',{post:post,image: cloudinary.image, image_url: cloudinary.url, url:get_url}))
            .catch((err) => res.error(err));
    });

    router.get('/', (req, res) => {
        let url = {val: req.headers.referer};
        postService.getAll()
         .then((posts) => res.render('pages/index',{posts:posts, url:url}))
            .catch((err) => res.error(err));
    });

    router.get('/destroy/:id', (req, res) => {
        postService.deleteById(req.params.id)
            .then((post) => res.redirect(req.headers.referer))
            .catch((err) => res.error(err));
    });

    router.get('/audio', (req, res) => {
        postService.getAllAudio()
            .then((posts) => res.render('pages/music',{posts:posts}))
            .catch((err) => res.error(err));
    });

    router.get('/video', (req, res) => {
        postService.getAllVideo()
            .then((posts) => res.render('pages/video',{posts:posts}))
            .catch((err) => res.error(err));
    });

    router.get('/images', (req, res) => {
        postService.getAllImages()
            .then((posts) => res.render('pages/images',{posts:posts}))
            .catch((err) => res.error(err));
    });

    router.get('/like/:id', (req, res) => {
        var userId = getUserId(req.cookies['x-access-token']);
        postService.likePost(userId,req.params.id)
            .then((posts) => res.redirect(req.headers.referer))
            .catch((err) => res.error(err));
    });

    router.get('/userimages', function (req, res) {
        var userId = getUserId(req.cookies['x-access-token']);
        postService.getAllUserImages(userId)
            .then((post) => res.render('user_pages/images',{posts:post}))
            .catch((err) => res.error(err));
    });

    router.get('/useraudio', function (req, res) {
        var userId = getUserId(req.cookies['x-access-token']);
        postService.getAllUserAudio(userId)
            .then((post) => res.render('user_pages/audio',{posts:post}))
            .catch((err) => res.error(err));
    });

    router.get('/uservideo', function (req, res) {
        var userId = getUserId(req.cookies['x-access-token']);
        postService.getAllUserVideo(userId)
            .then((post) => res.render('user_pages/video',{posts:post}))
            .catch((err) => res.error(err));
    });

    router.post('/correct/:id', function (req, res) {
        postService.updatePost(req.params.id,req.body)
            .then((post) => res.redirect(req.headers.referer))
            .catch((err) => res.error(err));
    });

     router.get('/correct/:id', (req, res) => {
         postService.getById(req.params.id)
             .then((posts) => res.render('pages/upd_post',{posts:posts,image: cloudinary.image, image_url: cloudinary.url,}))
             .catch((err) => res.error(err));
     });

    router.post('/search', (req, res) => {
        postService.searchPost(req.body.word)
            .then((posts) => res.render('pages/search',{posts:posts}))
            .catch((err) => res.error(err));
    });

    return router;
};