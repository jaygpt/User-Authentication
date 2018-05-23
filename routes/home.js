var express = require('express');
var router = express.Router();
var User = require('./users');
var async = require('async');
var Club = require('../models/club.js');
var bodyParser = require('body-parser');
router.get('/',ensureAuthentication,function(req,res){
        //console.log('MAY' + User.myname());
        var resl = [];
        Club.find({})
                .then((found) => {
                //console.log(found);
                for(let i = 0 ; i<found.length ; i++)
                    {
                        for(let j = 0; j<found[i].fans.length ; j++)
                            {
                                if(found[i].fans[j].username  == User.myname())
                                    {
                                        resl.push(found[i]);
                                    }
                            }
                    }
            
                res.render('dashboard', {title: 'Portal', resl: resl});
    })
});
router.post('/',function(req,res){
    var msg = req.body.message;
    console.log(msg);
    res.redirect('/home');
    
});

function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;