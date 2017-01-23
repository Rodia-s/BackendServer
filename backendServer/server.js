var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

var config = require('./config/config')
var mongoose = require('mongoose');
mongoose.connect(config.appConfig.mongoServer);

// test route to make sure everything is working (accessed at GET http://localhost:8080/)
var usersService = require("./service/usersService.js");

router.get('/b', function (req, res) {
    res.send('hooray! welcome to our api!');
});

/**
 * /users/verifyemail:
 *   get:
 *     description: verify email from the user after he gets register he receive a mail with a link and a token this function check the token validity
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id of token which is generated after the signup
 *         in: query
 *         required: true
 *     return : redirect on website
 */
router.post('/register', function (req, res) {
    console.log(req.body);
    usersService.registerUser(req.body)
        .then(function (retour) {
            console.log(retour);
            res.send(retour.statusCode, retour);
        })
        .catch(function (err) {
            console.log(err)
            res.send(err.statusCode, err);
        })
});
/**
 * /users/login:
 *   post:
 *     description: Log user with email and password and replying a JWT
 *     parameters:
 *       - name: emailPassword
 *         description: id object to log
 *         in: body
 *         required: true
 *     return : JWT
 */
router.post('/login', function (req, res) {
    var checkUser = usersService.login(req.body);
    checkUser
        .then(function (retour) {
            console.log(retour);
            res.send(retour.statusCode, retour);
        })
        .catch(function (err) {
            console.log(err);
            res.send(err.statusCode, err);
        })
});

/**
 * /users/logout:
 *   get:
 *     description: Logout user if he got the good JWT and delete it from the DB(to generate a valid token use login)
 *     parameters:
 *       - name: token
 *         description: JWT generate at login
 *         in: header
 *         required: true
 */
router.get('/logout', function (req, res) {
    var logout = usersService.logout(req);
    logout.then(function (retour) {
        res.send(retour.statusCode, retour);
    })
        .catch(function (err) {
            console.log("failed to logout");
            res.send(err.statusCode, err);
        })
});

/**
 * /users/logout:
 *   get:
 *     description: Logout user if he got the good JWT and delete it from the DB(to generate a valid token use login)
 *     parameters:
 *       - name: token
 *         description: JWT generate at login
 *         in: header
 *         required: true
 */
router.get('/logout', function (req, res) {
    var logout = usersService.logout(req);
    logout.then(function (retour) {
        res.send(retour.statusCode, retour);
    })
        .catch(function (err) {
            console.log("failed to logout");
            res.send(err.statusCode, err);
        })
});

/**
 *
 * description : delete a user from the DB if he still got some tips to deal with he is not delete
 * /users/removeuser:
 *   post:
 *     parameters:
 *       - name: token
 *         description: JWT  generate at login
 *         in: header
 *         required: true
 */
router.post('/removeuser', function (req, res) {
    var removeUser = usersService.removeUser(req);
    removeUser.then(function (retour) {
        res.send(200, retour);
    }).catch(function (erreur) {
        res.send(400, erreur);
    })
});




module.exports = app;