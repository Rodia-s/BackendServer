/**
 * Created by rano on 22/01/17.
 */
var mongoose = require('mongoose');
var userCollection = require("../Models/user");
var Q = require("q");
var promise = require('promise');
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
/**
 * function which enter a new profile in the DB
 * @param user1
 * @returns promise with success or failed message and statuscode
 */
var registerUser = function (userData) {
    var deferred = Q.defer();
    console.log(userData);
    var userModel = new userCollection(userData);
    userModel.save(function (err) {
        if (err) {
            console.log('bogoos')
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message =('USER_MONGODB_ERROR')
            failedMessage.infos = err;
            deferred.reject(failedMessage);
        }
        else {
            console.log('user rentré')
            deferred.resolve();
        }
    });
    return deferred.promise;
};
/**
 * Authentify user with his email and passer,...
 * @param emailPassword
 * @param passwordCrypt
 * @param tokenAuth
 * @returns {*|promise with a JWT associate to the user
 */
var login = function (emailPassword, tokenAuth) {
    var deferred = Q.defer();
    userCollection.findOneAndUpdate({"email": emailPassword.email}, {$set: {token: tokenAuth}}, function (err, res) {
        if (err) {
            failedMessage.message = {};
            failedMessage.message = ('USER_MONGODB_ERROR');
            failedMessage.infos = err;
            deferred.reject(failedMessage);
        }
        if (userCollection) {
            console.log(res);
            res.password = undefined;
            res.verifyEmailToken = undefined;
            console.log('User trouver et JWT donné pour 60min');
            deferred.resolve(res);
        }
        else {
            failedMessage.message = {};
            failedMessage.message = ('USER_DOCUMENT_NOT_FOUND');
            deferred.reject(failedMessage);
        }
    });
    return deferred.promise;
};
/**
 * Looking for a user with his email
 * @param mail
 * @returns {*|promise}
 */
function getUserByMail(mail) {
    var deferred = Q.defer();
    console.log(mail)
    userCollection.findOne({'email': mail}, function (err, res) {
        if (err) {
            console.log("popo")
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message = ('USER_MONGODB_ERROR')
            failedMessage.infos = err;
            deferred.reject(failedMessage);
        }
        if (res !== null) {
            console.log("popopa")
            deferred.resolve(res);
        }
        else {
            console.log("popopi")
            deferred.reject();
        }
    });
    return deferred.promise;
};



module.exports = {
    registerUser:registerUser,
    getUserByMail: getUserByMail,
    login: login
};