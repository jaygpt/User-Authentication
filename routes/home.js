var express = require('express');
var router = express.Router();
var myUser = require('./users.js');
var async = require('async');
var Club = require('../models/club.js');
var myuser = myUser.myname;
//console.log(myuser);
router.get('/',ensureAuthentication,function(req,res){
    async.parallel([
        function(callback){
            //find return the array
            Club.find({},(err,result) => {
                callback(err,result);
            });
        },
        /*
        ERROR HAI SAHI KAR KE USE KARO
        function(callback){
                    Club.aggregate({
                        $group: {
                            _id: "$positioninclub"
                        }
                    }, (err, newResult) => {
                       callback(err, newResult) ;
                    });
                },*/
    ],(err,results) => {
        const resl = results[0];
        //const resl1 = results[1];
        //console.log(resl);
        const dataChunk = [];
        const chunkSize = 3;
        for(let i = 0;i < resl.length ; i = i + chunkSize){
            dataChunk.push(resl.slice(i,i+chunkSize));
        }
        //console.log(dataChunk);
        res.render('dashboard', {title: 'Portal', resl: resl});
    })
    
});


function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;