/**
 * Created by UR on 5/9/2017.
 */
'use strict';

var mysql      = require('mysql');
var Promise = require('bluebird');
define(function (require) {
    var _config;
    var _pool;
    var DBController = {};
    var Logger = require('../Modules/Logger');
    DBController.initialize = function (config) {
        _config = config;
        return tryToConnectDB();
    };

    function tryToConnectDB() {
        return Promise.try(function () {
            _pool = mysql.createPool(_config);
        }.bind(this)).then(function () {
            return Promise.resolve();
        }).catch(function (err) {
            Logger.DataBase().error('tryToConnectDB err',err);
            return Promise.reject(err);
        })
    }

    function acquireConnection() {
        return new Promise(function (resolve, reject) {
            _pool.getConnection(function(err, connection) {
                if(err)
                {
                    Logger.DataBase().error('acquireConnection err1',err);
                    reject(err);
                }
                else
                    resolve(connection);
            });
        }.bind(this)).then(function (conn) {
            return Promise.resolve(conn);
        }).catch(function (err) {
            Logger.DataBase().error('acquireConnection err2',err);
            return Promise.reject(err);
        })
    }

    DBController.callQuery = function (queryString) {
        return new Promise(function(resolve, reject){
            acquireConnection().then(function (conn) {
                //console.log('Qrery',queryString);
                conn.query('CALL '+queryString, function (err, data) {
                    conn.release();
                    if(err)
                    {
                        Logger.DataBase().error('callQuery err1 '+queryString,err);
                        return reject(err);
                    }
                    //console.log('aaa',rows);
                    return resolve(data[0]);
                })
            }).catch(function (err) {
                Logger.DataBase().error('callQuery err2 '+queryString,err);
                return reject(err);
            })
        });
    };

    return DBController;
});
