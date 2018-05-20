var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var Club = require('../models/club.js');
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
    res.render('admin2');
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
            newClub.image = req.file.filename;
            //newClub.myName = username;

            newClub.save((err) =>{
                res.redirect('/');
                req.flash('failure_msg', 'Your detail is not saved');
            })
        }
    });
    
});
module.exports = router;