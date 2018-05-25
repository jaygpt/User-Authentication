var express = require('express');
var router = express.Router();
var User = require('./users');
var async = require('async');
var Club = require('../models/club.js');
var department_feed = require('../models/department_feed');

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
    })
    var feed = [];
            department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                if(news === null){
                    res.render('dashboard');
                }else{
                for(let j = 0; j<news.feeds.length;j++)
                    {
                        feed.push(news.feeds[j]);
                    }
                    console.log(feed);
                    res.render('dashboard', {title: 'Portal', resl: resl, feed: feed});
                }
            })
});

router.get('/:id',function(req,res){
    //WORK IN PROGRESS
    var id = req.params.id;
    department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                //console.log(news);
                var resl = [];
                for(let j = 0; j<news.feeds.length ;j++)
                    {
                        if(news.feeds[j]._id.equals(id))
                        {
                            for(let k = 0;k<news.feeds[j].comments.length;k++)
                                {
                                    resl.push(news.feeds[j].comments[k]);
                                }
                        }
                    }
//                    console.log(feed);
                    res.render('comments',{resl : resl});
    })
});
router.post('/:id',function(req,res){
    //WORK IN PROGRESS
    var id = req.params.id;
    department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                //console.log(news);
                var comment = {
                    commentor: User.myname(),
                    comments: req.body.message
                }
                for(let j = 0; j<news.feeds.length ;j++)
                    {
                        if(news.feeds[j]._id.equals(id))
                        {
                            news.feeds[j].comments.push(comment);
                            news.save();
                            //console.log(news.feeds[j].comments[0]);
                        }
                    }
                res.redirect('/home');
    })
});


router.post('/',function(req,res){
    var msg = req.body.message;
    //console.log(msg);
    //console.log(User.mydepartment());
    department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                        var post = {
                        sender: User.myname(),
                        message: msg
                        }
                        if(news === null)
                            {
                                var dep = new department_feed();
                                dep.department = User.mydepartment();
                                dep.feeds.push(post);
                                dep.save();
                            }else{
                                news.feeds.push(post);
                                news.save();
                            }
            })
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