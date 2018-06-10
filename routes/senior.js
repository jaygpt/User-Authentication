const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const User = require('../models/user');

router.get('/:id',function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
        var interest = user.profile.clubi;
        //console.log(user.club);
        MongoClient.connect(url,{ useNewUrlParser: true } ,function(err, db) {
            if (err) throw err;
            var dbo = db.db("loginapp");
            dbo.collection("users").find({club:interest}).toArray(function(err, result) {
                //console.log(result);
              if (err) throw err;
              res.render('senior',{result:result});
              db.close();
            });
          }); 
    });
});
router.get('/show/:id',function(req,res){
    User.findOne({_id:req.params.id}).then(function(user){
        res.render('admin/senior/profile',{user:user});
    })
});
 
module.exports = router;