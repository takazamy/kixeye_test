/**
 * Created by UR on 4/12/2018.
 */
var express = require('express');

define(function (require) {
    var Router = express.Router();
    Router.get('/', isLoggedIn, (req, res) => {
        console.log('api/admin/');
        //var ApiLeaderBoard = require('../ApiLeaderBoard');
        var userID = parseFloat(req.query.UserID);
        console.log('userID:',userID);
       // var user = ApiLeaderBoard.getUserByID(userID);
        res.render('admin.html', {
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
            console.log('isLoggedIn 2',user);
            if (user && user.userType == 1)
                return next();

            var data = {result: 0, code: 'Require Login', message: 'Require Login', desc: null, data: null};
            res.redirect('/login');
            // res.status(200).json(data);
        }
        catch(e){
            console.log(e);
            var data = {result: 0, code: 'Require Login', message: 'Require Login', desc: null, data: null};
            //res.status(200).json(data);
            res.redirect('/login');
        }

    }
    return Router;
});