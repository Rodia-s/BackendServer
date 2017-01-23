/**
 * Created by rano on 23/01/17.
 */
var usersService = require('./usersService');


var usersDao = require('../dao/usersDao');
var filmsDao = require("../dao/filmsDao");

var Q = require("q");
var successMessage = {
    "Success": true,
    "infos": {}
    ,
    "statusCode": {}
};
var failedMessage = {
    "Success": false,
    "message": {}
    ,
    "statusCode": {}
}
/**
 * function that create a tips
 * @param req
 * @returns {*|promise}
 */
function addFilms(req) {
    var deferred = Q.defer();
    console.log(req.body);
    var films = req.body ;
    usersService.checkToken(req)
        .then(function (decoded) {
            films.uploader = decoded.email;
            films.upload_date = Date.now();
            filmsDao.saveFilms(films)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        })
        .catch(function (err) {
                deferred.reject(err)
            })
    return deferred.promise;
};

/**
 * function that return all filùs
 * @params none
 * @returns {*|promise}
 */
function getAllFilms(req) {
    var deferred = Q.defer();
    usersService.checkToken(req)
        .then(function () {
            filmsDao.getAllFilms()
                .then(function (res) {
                    successMessage.infos = {};
                    successMessage.infos = res;
                    successMessage.statusCode = 200
                    deferred.resolve(successMessage);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        })
        .catch(function (err) {
            deferred.reject(err);
        })
    return deferred.promise;
};

module.exports = {
   addFilms:addFilms,
    getAllFilms: getAllFilms,
};