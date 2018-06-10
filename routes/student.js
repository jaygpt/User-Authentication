const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://jaygpt:Qwert12345@ds011268.mlab.com:11268/";
const User = require('../models/user');

router.get('/',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true } ,function(err, db) {
        if (err) throw err;
        var dbo = db.db("departmental_portal_iitk");
        dbo.collection("users").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.render('admin/search/student',{result:result});
          db.close();
        });
      });
});
router.post('/',function(req,res){
    User.findOne({name: req.body.name}).then(function(user){
         console.log(user);
         res.render('admin/search/profile',{user:user});
     });
    
});
module.exports = router;