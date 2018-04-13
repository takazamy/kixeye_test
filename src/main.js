/**
 * Created by UR on 4/12/2018.
 */
'use strict';
var requirejs = require('requirejs');


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    baseUrl: __dirname,
    nodeRequire:require
});


requirejs(['ApiLeaderBoard'],
    function (ApiLeaderBoard) {
        var a = new ApiLeaderBoard();

    }

);
