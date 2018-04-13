/**
 * Created by UR on 4/12/2018.
 */
process.env.TZ = 'UTC';
//var util = require('util');
const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const crypto = require('crypto');
const Promise = require('bluebird');
const path = require('path');
const ejs = require('ejs');
const bodyParser  = require('body-parser');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
define(function (require) {
    const config = require('./Config/index');
    const LoggerConfig = require('./Config/LoggerConfig');
    const db = require('./Database/DBService');
    const dbController = require('./Database/DBController');
    const listUser = [];
    const Logger = require('./Modules/Logger');
    const SocketController = require('./SocketController/SocketController');
    const app = express();

    const startRoute = require('./Routes/start');
    //const devRoute = require('./Routes/dev');
    const adminRoute = require('./Routes/admin');
    const userRoute = require('./Routes/user');
    const server = http.createServer(app);
    const sessionParser = session({
        saveUninitialized: false,
        secret: '$eCuRiTy',
        resave: false
    });
    app.use(sessionParser);
    const wss = new WebSocket.Server({verifyClient: (info, done) => {
        console.log('Parsing session from request...');
        sessionParser(info.req, {}, () => {
            console.log('Session is parsed!');
            if(!info.req.session.userId)
                done(false);
            else
                done(info.req.session.userId);
        });
    }, server },function (err) {
        if (!err){
            const interval = setInterval(function ping() {
                wss.clients.forEach(function each(ws) {
                    if (ws.isAlive === false)
                        return ws.terminate();

                    ws.isAlive = false;
                    ws.ping(noop);
                });
            }, 30000);
        }

    });
    function noop() {}

    function heartbeat() {
        this.isAlive = true;
    }

    class ApiLeaderBoard{
        constructor(){

            app.set('TZ','UTC');
            app.set('view engine', 'ejs');
            Promise.all([
                Logger.initialize(0,LoggerConfig),
                dbController.initialize(config.mysql),

            ]).then(function () {
               /* app.listen(config.port, function () {
                    console.log('ApiLeaderBoard listening on port ', config.port);
                });*/
                wss.on('connection', function connection(ws, req) {
                    const location = url.parse(req.url, true);
                    console.log('socket Connect',req.session.userData, req.session.userId);


                    ws.session = req.session;
                    ws.userType = req.session.userType;
                    ws.userID = req.session.userId;
                    // You might use location.query.access_token to authenticate or share sessions
                    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
                    ws.socketController = new SocketController(this, ws);
                    var user = ApiLeaderBoard.findUserById(req.session.userId);
                    user.socket = ws;
                    ws.on('message', ws.socketController.handleMessage.bind(ws.socketController,req));
                    ws.on('error', function (err) {
                       // Logger.Default().error('Socket Err', req.session.userId, err);

                        ws.terminate();
                    });
                    ws.on('close',function (err) {
                       // Logger.Default().error('Socket Err', req.session.userId, err);

                        ws.terminate();
                    });
                    ws.isAlive = true;
                    ws.on('pong', heartbeat);
                    /*ws.on('message', function incoming(message) {
                        console.log('received: %s', message);
                    });*/

                    //ws.send('Connect WS');
                });
                wss.broadcast = function broadcast(data) {
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    });
                };


                server.listen(config.port, function listening() {
                    console.log('Listening on %d', server.address().port);
                });
                this.initCompleted();
            }.bind(this)).catch(function (err) {
                console.log('API Game initialize fail ',err);
            });


            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            app.set('views','./View/');
            app.engine('html', ejs.renderFile);
            app.set('view engine', 'html');
            //app.use(startRoute);
            app.use('/',startRoute);
            //app.use('/dev', devRoute);
            app.use('/api/admin', adminRoute);
            app.use('/api/user', userRoute);


        }

        initCompleted() {
            console.log('initCompleted');
        };


    }
    ApiLeaderBoard.wss = wss;
    ApiLeaderBoard.listUser = listUser;
    ApiLeaderBoard.findUserById = function (userId) {
        console.log('findUserById',ApiLeaderBoard.listUser);
        for(var i = 0; i < ApiLeaderBoard.listUser.length; i++){
            var user = ApiLeaderBoard.listUser[i];
            if (user.userID == userId) {
                return user;
            }
        }
        return null;
    };
    ApiLeaderBoard.updateInfo = function (userData) {
          var user = ApiLeaderBoard.findUserById(userData.UserID);
          if(user)
              user.updateInfo(userData);

    };
    ApiLeaderBoard.addUser = function(user){
        var current = ApiLeaderBoard.findUserById(user.userID);
        if(current == null){
            ApiLeaderBoard.listUser.push(user);
        }else{
            var index = ApiLeaderBoard.listUser.indexOf(current);
            ApiLeaderBoard.listUser[index] = user;
        }
        console.log('addUser',user,ApiLeaderBoard.listUser.length );

    };
    ApiLeaderBoard.removeUserByID = function (userID) {
        var current = ApiLeaderBoard.findUserById(userID);
        if(current){
            var index = ApiLeaderBoard.listUser.indexOf(current);
            current.socket.terminate();
            ApiLeaderBoard.listUser.splice(index,1);
        }
        console.log('removeUserByID',userID,ApiLeaderBoard.listUser.length );
    };
    return ApiLeaderBoard;
});

