var express = require('express');
var router = express.Router();
var User = require('./users');
var async = require('async');
var Club = require('../models/club.js');
var user = require('../models/user.js');
var department_feed = require('../models/department_feed');
var multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({
      storage: storage
      //for other condition of limits thus in this class wes
  }).single('filename');

router.get('/',ensureAuthentication,function(req,res){
        //console.log('MAY' + User.myname());
        var clubs = [];
        Club.find({})
                .then((found) => {
                //console.log(found);
                for(let i = 0 ; i<found.length ; i++)
                    {
                        for(let j = 0; j<found[i].fans.length ; j++)
                            {
                                if(found[i].fans[j].username  == req.user.username)
                                    {
                                        clubs.push(found[i]);
                                    }
                            }
                    }                
    })
    var feed = [];
            department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                if(news === null){
                    res.render('dashboards');
                }else{
                for(let j = news.feeds.length - 1; j>= 0;j--)
                    {
                        var userimg = "";
                        user.findOne({username:news.feeds[j].sender})
                            .then((found) =>{
                                userimg = found.profile.image;
                                console.log(userimg);
                            
                        var obj = { 
                            comments: news.feeds[j].comments,
                            _id: news.feeds[j]._id,
                            sender: news.feeds[j].sender,
                            message: news.feeds[j].message,
                            image: news.feeds[j].image,
                            userimage : userimg
                        }
                        feed.push(obj);
                    })
                    }
                    console.log(feed);
                    res.render('dashboards', {title: 'Portal',clubs: clubs, feed: feed});
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
    var username = req.body.sender;
    //console.log(msg);
    //console.log(User.mydepartment());
    upload(req,res,(err) => {
        if(err){
            res.render('index',{msg: err});
        }
        else{
            if(req.file !== undefined){
                department_feed.findOne({department:User.mydepartment()})
                .then((mydepartment) => {
                var post = {
                    sender: User.myname(),
                    message: null,
                    image: req.file.filename
                }
                if(mydepartment === null)
                            {
                                var dep = new department_feed();
                                dep.department = User.mydepartment();
                                dep.feeds.push(post);
                                dep.save();
                            }else{
                                mydepartment.feeds.push(post);
                                mydepartment.save();
                            }
            })
            console.log(req.file);
            }
            else{
                department_feed.findOne({department: User.mydepartment()})
                .then((news) => {
                        var post = {
                        sender: User.myname(),
                        message: msg,
                        image: null
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
            }
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