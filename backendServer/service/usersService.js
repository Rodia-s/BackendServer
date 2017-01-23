/**
 * Created by rano on 22/01/17.
 */
var usersDao = require("../dao/usersDao");
var Q = require("q");
var jwt = require('jsonwebtoken');
var promise = require('promise');
var mongoose = require('mongoose');
var crypto = require('crypto');
var successMessage = {
    "Success": true,
    "infos": {}
    ,
    "statusCode": {}
};
var failedMessage ={
    "Success": false,
    "message": {}
,
"statusCode": {}
}

var registerUser = function (user) {
    var deferred = Q.defer();
    usersDao.getUserByMail(user.email)
        .catch(function (err) {
            if (err !== failedMessage) {
                user._id = mongoose.Types.ObjectId();
                user.password = hashPassword(user.password);
                user.token = undefined;
                console.log(user)
                usersDao.registerUser(user)
                    .then(function () {
                        successMessage = {};
                        successMessage.infos = ('USER_REGISTER_SUCCESS');
                        successMessage.statusCode = 201;
                        deferred.resolve(successMessage);
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    })
                return deferred.promise;
            }
        })
        .then(function(){
            failedMessage = {};
            failedMessage.message = ('USER_EMAIL_UNIQUE');
            failedMessage.statusCode = 409;
            deferred.reject(failedMessage);
        })
    return deferred.promise;
};


/**
 * function to hash password
 * @param password
 * @returns {passwordCrypt}
 */
function hashPassword(password) {
    var passwordCrypt = crypto.createHmac('sha256', password)
        .digest('hex');
    return passwordCrypt;
};

/**
 *function to authenticate a user with an email and a password , create a webtoken that make possible secure navigation
 * @param emailPassword
 * @returns {*|promise}
 */
var login = function (emailPassword) {
    var deferred = Q.defer();
    getUser(emailPassword.email)
        .catch(function (err) {
            failedMessage = {};
            failedMessage.statusCode = 401
            failedMessage.message = ('USER_NOT_REGISTER');
            deferred.reject(failedMessage);
        })
        .then(function (res) {
            var passwordCrypt = hashPassword(emailPassword.password);
            if (passwordCrypt !== res.password) {
                failedMessage.message = {};
                failedMessage.statusCode = 401;
                failedMessage.message = ('USER_WRONG_PASSWORD')
                deferred.reject(failedMessage);
            }
            else{
                var tokenAuth = jwt.sign({email: res.email}, "TRALALALALA", {
                    expiresIn: '60m',
                    algorithm: 'HS256'
                });
                usersDao.login(emailPassword, tokenAuth)
                    .then(function (res) {
                        successMessage.infos = {};
                        console.log(successMessage.info);
                        successMessage.infos.token = tokenAuth;
                        successMessage.statusCode = 200;
                        deferred.resolve(successMessage);
                        console.log("Vous êtes logger " + res.firstname);
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    })
                return deferred.promise;
            }
        })
    return deferred.promise;
};

/**
 * function which is looking for a user with his mail and pass it if it find it (to authenticate
 * @param mail
 * @returns {user}
 */
function getUser(mail) {
    var deferred = Q.defer();
    usersDao.getUserByMail(mail)
        .then(function (res) {
            {
                deferred.resolve(res);
            }
        })
        .catch(function (err) {
            {
                console.log(err);
                deferred.reject(err);
            }
        })
    return deferred.promise;
};

module.exports = {
    registerUser:registerUser,
    getUser: getUser,
    login: login 
};