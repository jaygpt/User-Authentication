var express = require('express');
var router = express.Router();
var User = require('./users');
var async = require('async');
var Club = require('../models/club.js');
var user = require('../models/user.js');
//var Post = require('../models/post.js');
var Message = require('../models/message.js');
var department_feed = require('../models/department_feed');
var path = require('path');
const {isEmpty} = require('../helpers/uploadhelper');

const upload = require('express-fileupload');
router.use(upload());

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
                        /* var userimg = "";
                        user.findOne({username:news.feeds[j].sender})
                            .then((found) =>{
                                userimg = found.profile.image;
                                console.log(userimg);
                            }) */
                            
                                var obj = { 
                                    comments: news.feeds[j].comments,
                                    _id: news.feeds[j]._id,
                                    sender: news.feeds[j].sender,
                                    message: news.feeds[j].message,
                                    image: news.feeds[j].image,
                                    //userimage : userimg
                                }
                                feed.push(obj);
                    }
                    //console.log(feed);
                    Message.aggregate([
                        {$match : {'receiverName': req.user.username}},
                        {$sort: {'createdAt': -1}},
                        {
                            $group: {"_id" :{
                                "last_message_between":{
                                    $cond:[
                                        {
                                            $gt:[
                                                {$substr:["$senderName", 0 , 1]},
                                                {$substr: ["receiverName",0,1]}
                                            ]
                                        },
                                        {$concat: ["$senderName"," and ","$receiverName"]},
                                        {$concat: ["$receiverName"," and ","$senderName"]}
                                    ]
                                }
                            }, "body" : {$first: "$$ROOT"}
                        }
                        }
                    
                    ])
                    .then((noti) => {
                        res.render('dashboards', {title: 'Portal',clubs: clubs, feed: feed, mes:noti});
                    })
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
    let filename = '';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + file.name;
        file.mv('./public/uploads/'+filename,function(err){
            if(err) return err;
        });
    }
    department_feed.findOne({department: User.mydepartment()})
    .then((news) => {
        const posts = {
            message: req.body.message,
            image: filename,
            sender: User.myname()
        };
        console.log(posts);
        if(news === null)
                            {
                                var dep = new department_feed();
                                dep.department = User.mydepartment();
                                dep.feeds.push(posts);
                                dep.save();
                            }else{
                                news.feeds.push(posts);
                                news.save()
                                .then(function(result){
                                    res.redirect('/admin/posts');
                               }).catch(function(err){
                                   return err;
                               });
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