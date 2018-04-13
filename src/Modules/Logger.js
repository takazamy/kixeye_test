/**
 * Created by UR on 4/3/2018.
 */
var Log4JS = require('log4js');
var fs = require('fs');
var Promise = require('bluebird');
define(function (require) {
    var Config = require('../Config/LoggerConfig');
    var Logger ={};
    Logger.initialize = function () {
        var appenders = {};
        var categories = {};
        if(!fs.existsSync(Config.LogDir)){
            fs.mkdirSync(Config.LogDir);
        }
        return Promise.try(function () {
            appenders.console = {
                type:'console'
            };
            for(var logCfg in Config){
                if(logCfg === 'LogLevel')
                    continue;
                if(logCfg === 'LogDir')
                    continue;
                var logAppender = {
                    type: 'dateFile',
                    filename: Config[logCfg].RootDir + Config[logCfg].Filename,
                    pattern: '-yyyyMMdd.log',
                    alwaysIncludePattern: true,
                    daysToKeep:35
                };
                appenders[logCfg] = logAppender;
                categories[logCfg] = {
                    appenders: [ logCfg,'console' ], level: 'debug'
                };

                //appenders.push(logAppender);
                if(!fs.existsSync(Config[logCfg].RootDir)){
                    fs.mkdirSync(Config[logCfg].RootDir);
                }
            }
            Log4JS.configure({
                appenders: appenders,
                categories:categories
            })
        })
    };

    Logger.Default = function () {
        return Log4JS.getLogger('Default');
    };

    Logger.DataBase = function () {
        return Log4JS.getLogger('DataBase');
    };

    return Logger;
});