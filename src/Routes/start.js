/**
 * Created by UR on 4/12/2018.
 */
var express = require('express');

define(function (require) {
    var Router = express.Router();
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

    Router.get('/logout',function (req, res) {

        var ApiLeaderBoard = require('../ApiLeaderBoard');
        ApiLeaderBoard.removeUserByID(req.session.userId);
        req.session.destroy();
        res.send({ result: 'OK', message: 'Session destroyed' });
    });

    function isLoggedIn(req, res, next) {
        console.log('Start IsLoggerIn', req.user);
        if (req.user && req.session.userId)
            return next();

        res.redirect('/login');
    }

    return Router;
})

