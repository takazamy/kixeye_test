/**
 * Created by UR on 4/12/2018.
 */
const express = require('express');
const crypto = require('crypto');
define(function (require) {
    var Router = express.Router();
    const db = require('../Database/DBService');
    const Logger = require('../Modules/Logger');
    const Config = require('../Config/index');
    const User = require('../Model/User');
    Router.post('/login', (req, res, next) => {
        try{
            var userName = req.body.UserName;
            var password  = req.body.Password;

            console.log(`${userName} login with ${password}`);
            var pwMD5 = crypto.createHash('md5').update(password).digest("hex");
            console.log(pwMD5);
            db.checkLogin(userName, pwMD5).then(function (rows) {
                console.log(rows);
                if (rows && rows.length > 0 && rows[0].result > 0) {
                    const ApiLeaderBoard = require('../ApiLeaderBoard');
                    var userData = rows[0];
                    var user = new User(userData);
                    req.session.userData = userData;
                    req.session.userId = user.userID;
                    req.session.userType = user.userType;
                    ApiLeaderBoard.addUser(user);
                    var data = {result: 1, code: 'Login Success', message: 'DONE', desc: null, data: user};
                    res.status(200).json(data);

                }
                else{
                    var data = {result: 0, code: 'Login Fail', message: 'User not exist', desc: null, data: null};

                    res.status(200).json(data);
                }

            }).catch(function (err) {
                Logger.Default().error('Login',err);
                var data = {result: 0, code: 'Login Fail', message: 'Not Success', desc: null, data: err};
                res.status(200).json(data);
            });

        }catch(e){
            Logger.Default().error('Login',e);
            var data = {result: 0, code: 'Login Fail', message: 'Not Success', desc: null, data: e};
            res.status(200).json(data);

        }

    });

    Router.post('/register',(req, res, next) => {
        //console.log('register',req.body);
        try{
            var userName = req.body.UserName;
            var password  = req.body.Password;
            console.log(userName, 'create with' , password);
            var pwMD5 = crypto.createHash('md5').update(password).digest("hex");
            console.log(pwMD5);
            var data = {result: 0, code: 'Create Fail', message: 'Not Success', desc: null, data: null};
            db.createNewUser(userName, pwMD5).then(function (rows) {
                console.log(rows);
                if (rows && rows.length > 0 && rows[0].result > 0) {
                    var userData = rows[0];

                    const ApiLeaderBoard = require('../ApiLeaderBoard');
                    var user = new User(userData);
                    req.session.userData = userData;
                    req.session.userId = user.userID;
                    req.session.userType = user.userType;
                    ApiLeaderBoard.addUser(user);
                    data = {result: 1, code: 'Create Success', message: 'DONE', desc: null, data: user};
                    res.status(200).json(data);
                    //res.redirect('/api/user');
                }
                else {
                    data = {result: 0, code: 'Create Fail', message: 'Not Success', desc: null, data: null};
                    res.status(200).json(data);
                }

            }).catch(function (err) {
                console.log(err);
                data = {result: 0, code: 'Create Fail', message: 'Not Success', desc: null, data: err};
                res.status(200).json(data);

            });
        }catch(e){
            Logger.Default().error('Create User err',e);
            data = {result: 0, code: 'Create Fail', message: 'Not Success', desc: null, data: e};
            res.status(200).json(data);

        }


    });

    Router.get('/', isLoggedIn, (req, res) => {
        console.log('api/user/');
        //var ApiLeaderBoard = require('../ApiLeaderBoard');
        var userID = parseFloat(req.query.UserID);
        console.log('userID:',userID);
        //var user = ApiLeaderBoard.getUserByID(userID);
        res.render('user.html', {
            title: 'UserPage',
            User: req.session.userData
        },function (err, html) {
            res.send(html);
        });
    });

    function isLoggedIn(req, res, next) {
        try{
            var ApiLeaderBoard = require('../ApiLeaderBoard');
            var userID = parseInt(req.query.UserID);
            if(isNaN(userID)){
                userID = req.body.UserID;
            }


            var user = ApiLeaderBoard.findUserById(userID);
            //console.log('isLoggedIn 2',user);
            if (user)
                return next();

            var data = {result: 0, code: 'Require Login', message: 'Require Login', desc: null, data: null};
            //res.status(200).json(data);
            res.redirect('/login');
        }
        catch(e){
            console.log(e);
            var data = {result: 0, code: 'Require Login', message: 'Require Login', desc: null, data: null};
            //res.status(200).json(data);
            res.redirect('/login');
        }

    }
//TODO Chua check userLoged in khi doi ten, update score
    return Router;
});