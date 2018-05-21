var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var Club = require('../models/club.js');
var async = require('async');
//for uploading the files
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
    storage: storage
    //for other condition of limits thus in this class wes
}).single('myImage');


router.get('/',function(req,res){
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
        res.render('admin2', {title: 'Portal', resl: resl});
});
});
//when we submit the form there will be a post request
router.post('/',(req,res) => {
    upload(req,res,(err) => {
        //for error
        if(err){ res.sendFile('/home/jay/Desktop/new/userauth/views/admin/admin2.html');
        req.flash('faliure_msg', 'You are not registered and can now login');
        }else{
            var username = req.body.name;
            //console.log(req.file);
            var newClub = new Club(); 
            newClub.name = req.body.club;
            newClub.positioninclub = req.body.position;
            //newClub.image = req.file.filename;
            //newClub.myName = username;

            newClub.save((err) =>{
                res.redirect('/');
                req.flash('failure_msg', 'Your detail is not saved');
            })
        }
    });
    
});
module.exports = router;