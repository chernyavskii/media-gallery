'use strict'
var express = require('express');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = (authService, config) => {
    const router = express.Router();

    router.post('/register',multipartMiddleware, (req, res) => {
        authService.register(req.body,req.files.image.path)
            .then((userId) => {
                let login_data = {
                    email: userId.dataValues.email,
                    password: userId.dataValues.password
                }
                authService.login(login_data)
                    .then((user) => {
                        let token = jwt.sign({ __user_id: user.id }, config.cookie.key);
                        res.cookie('x-access-token',token);
                        if(user.roleId == 2) {
                            let url = req.body.ref_path;
                            if(url == "")
                            {
                                res.redirect('/posts/');
                            }
                            else {
                                console.log("QWERT");
                                res.redirect(url);
                            }
                        }
                        if(user.roleId == 1) {
                            res.redirect('/users/admin')
                        }
                    })
                    .catch((err) => res.error(err))
            })
            .catch((err) => res.error(err));
    });

    router.post('/login', (req, res) => {
        authService.login(req.body)
            .then((userId) => {
                let token = jwt.sign({ __user_id: userId.id }, config.cookie.key);
                res.cookie('x-access-token',token);
                if(userId.roleId == 2) {
                    let url = req.body.ref_path;
                    if(url === "")
                    {
                        res.redirect('/posts/');
                    }
                    else {
                        res.redirect(url);
                    }
                }
                if(userId.roleId == 1) {
                    res.redirect('/users/admin')
                }
            })
            .catch((err) => res.error(err));
    });

    router.get('/logout', (req, res) => {
        res.clearCookie('x-access-token');
        res.redirect('/auth/login')
    });

    router.get('/login', (req,res) =>{
        let error = {
            message: "",
            code: "",
            status: "",
        };
        res.render('pages/login',{err:error,ref_path: req.query.ref_path});
    });

    return router;
};