/**
 * Created by rano on 23/01/17.
 */
var mongoose = require('mongoose');
var userCollection = require("../Models/user");
var filmCollection = require("../Models/film")
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
};

/**
 * function that create a new object in tipsCollection given argument a tips models
 * @param tips
 * @returns {*|promise}
 */
function saveFilms(film) {
    var deferred = Q.defer();
    var filmModel = new filmCollection(film);
    filmModel.save(function (err, res) {
        if (err) {
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message = ('Film_MONGODB_ERROR');
            deferred.reject(err);
        }
        else {
            successMessage.infos = {};
            successMessage.statusCode = 200;
            successMessage.infos = ('Film_REGISTER_SUCCESS');
            deferred.resolve(successMessage);
        }
    });
    return deferred.promise;
};

/**
 * function that return all stuff in filmsCollection
 * @returns {*|promise}
 */
function getAllFilms() {
    var deferred = Q.defer();
    filmCollection.find({}, '', function (err, res) {
        if (err) {
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message = ('TIPS_MONGODB_ERROR');
            deferred.reject(err);
        }
        if (res[0] !== undefined) {
            var arr = [];
            for (var i = 0; i < res.length; i++) {
                arr[i] = res[i];
            }
            console.log(arr);
            deferred.resolve(arr);
        }
        else {
            deferred.reject();
        }
    })
    return deferred.promise;
};
/**
 * function that return the film by id
 * @param id
 * @returns {*|promise}
 */
function getFilmById(id) {
    var deferred = Q.defer();
    console.log(id);
    filmCollection.findOne({"title": id}, function (err, res) {
        if (err) {
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message = ('TIPS_MONGODB_ERROR');
            deferred.reject(err);
        }
        if (res !== null) {
            console.log(res)
            deferred.resolve(res);
        }
        else {
            failedMessage.message = {};
            failedMessage.statusCode = 400;
            failedMessage.message = ('USER_DOCUMENT_NOT_FOUND');
            deferred.reject(failedMessage);
        }
    });
    return deferred.promise;
};

/**
 * function that delete a tips of the Data base
 * @type {{saveTips: saveTips, getAllTips: getAllTips}}
 */
function removeFilm(req) {
    var deferred = Q.defer();
    console.log(req.title)
    filmCollection.findOneAndRemove({"title": req.title}, '', function (err, res) {
        if (err) {
            failedMessage.message = {};
            failedMessage.statusCode = 500;
            failedMessage.message = ('FILMS_MONGODB_ERROR');
            deferred.reject(err);
        }
        if (res !== null) {
            successMessage.infos = {};
            successMessage.statusCode = 200
            successMessage.infos = ('FILMS_SUCCESS_DELETE');
            deferred.resolve(successMessage);
        }
        else {
            failedMessage.message = {};
            failedMessage.statusCode = 400;
            failedMessage.message = ('FILMS_NOT_FOUND')
            deferred.reject(failedMessage);
        }
    });
    return deferred.promise;
};


module.exports = {
    saveFilms: saveFilms,
    getAllFilms:getAllFilms,
    removeFilm : removeFilm, 
    getFilmById: getFilmById
};