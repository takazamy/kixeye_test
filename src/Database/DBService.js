/**
 * Created by UR on 5/9/2017.
 */
'use strict';
var Promise = require('bluebird');
define(function (require) {
    var controller = require('./DBController');

    var DBService = {};

    DBService.getLog = function (startTime, endTime) {
        console.log('prc_getLog('
            +'"'+startTime+'",'+'"'+endTime +'"'+
            ')');
        return controller.callQuery('prc_getLog('
            +'"'+startTime+'",'+'"'+endTime +'"'+
            ')').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.getUsers = function () {
        return controller.callQuery('prc_getUser()').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.checkLogin = function (userName, pass) {
        return controller.callQuery('prc_checkLogin('
            +'"'+userName+'",'+'"'+pass+'")').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.createNewUser = function (userName, pass) {
        console.log('prc_createNewUser('
            +'"'+userName+'",'+'"'+pass+'")');
        return controller.callQuery('prc_createNewUser('
            +'"'+userName+'",'+'"'+pass+'")').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.removeUserByID = function (userID) {
        return controller.callQuery('prc_removeUserByID('
            +userID+')').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.updateUserScore = function (userID, score) {
        return controller.callQuery('prc_userUpdateScore('
                +userID+','
            +score+')').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    DBService.updateUserName = function (userID, userName) {
        return controller.callQuery('prc_updateUserName('
            +userID+','
            +'"'+userName+'")').then(function (rows) {
            return Promise.resolve(rows);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };

    return DBService;

});