/**
 * Created by UR on 4/12/2018.
 */
var express = require('express');

define(function (require) {
    var Router = express.Router();

    var Logger = require('../Modules/Logger');

    /* GET home page. */
    Router.get('/', isLoggedIn, function (req, res) {
        const user = req.user;

        res.render('index.html', {
            user: req.user
        });
    });

    Router.get('/login', function (req, res) {
        console.log('web to Login page');

        res.render('login.html', {
            title: 'Login'
        });
    });


    Router.post('/logout',(req, res, next) => {
        try{
            console.log('LogOut');
            var userID = req.body.UserID;
            var ApiLeaderBoard = require('../ApiLeaderBoard');
            ApiLeaderBoard.removeUserByID(userID);
            req.session.destroy();
            res.redirect('/login');
        }catch(e){
            Logger.Default().error('logout er',e);
        }

    });

    function isLoggedIn(req, res, next) {
        console.log('Start IsLoggerIn', req.user);
        if (req.user && req.session.userId)
            return next();

        res.redirect('/login');
    }

    return Router;
})

