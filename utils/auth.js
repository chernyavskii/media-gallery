'use strict'
var jwt = require('jsonwebtoken');

module.exports = (authService, config, errors) => {
    return (req, res, next) => {
        var get_cookie = req.cookies['x-access-token'];
        let ref_url = req.url;
        let path;
        path = req.url;
        var split_media = JSON.stringify({value_type :path.split("/")});
        var value_parse = JSON.parse(split_media);

        if(value_parse.value_type[3] != undefined) {
            path = "/"+value_parse.value_type[1]+"/"+value_parse.value_type[2]+"/"+":id";
        }
        else {
            path = req.url;
        }
        if(get_cookie != undefined) {
            var verifiedJwt = jwt.verify(get_cookie, config.cookie.key);
            var userId = verifiedJwt.__user_id;
            authService.checkPermissions(userId, path)
                .then(() => next())
                .catch(() => res.error(errors.accessDenied));
        }
        else {
            authService.checkPermissions(userId, path)
                .then(() =>  next())
                .catch(() => res.render('pages/error_page',{ref_path:ref_url}));
        }
    };
};
