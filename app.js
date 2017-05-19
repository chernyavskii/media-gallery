const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const errors = require('./utils/errors');
const config = require('./config');

const dbcontext = require('./context/db')(Sequelize, config);

const userService = require('./services/user')(dbcontext.user,dbcontext.userRole,dbcontext.post,  errors);
const postService = require('./services/posts')(dbcontext.post,dbcontext.user,dbcontext.like, errors);
const authService = require('./services/auth')(dbcontext.user,dbcontext.role,dbcontext.userRole, errors);
const cacheService = require('./services/cache');

const apiController = require('./controllers/api')(authService,postService, userService, cacheService, config, errors);

const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);

const cache = require('./utils/cache')(cacheService);
const app = express();
app.use("/public",express.static(__dirname + "/public"));
//app.use(express.static('public'));
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use('/', logger);
app.use('/', auth);
app.use('/', cache);
app.use('/', apiController);

app.use('/',function(req, res, next) {
    res.sendData = function(obj) {
        var contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            res.header('Content-Type', 'application/json');
            res.send(obj);
        } else if (contentType == 'application/xml') {
            res.header('Content-Type', 'text/xml');
            var xml = serializer.render(obj);
            res.send(xml);
        } else {
            res.send(obj);
        }
    };
    next();
});

const port = process.env.PORT || 3000;

dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(port, () => console.log('Running on http://localhost:3000'));
    })
    .catch((err) => console.log(err));