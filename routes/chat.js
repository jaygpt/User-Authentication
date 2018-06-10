var express = require('express');
var router = express.Router();
var club = require('../models/club');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');
var user = require('../models/user');
var Message = require('../models/message');
var User = require('./users');

router.get('/',ensureAuthentication,(req,res) => {
    var alluser = [];
    // You can remove this extra effort of calling username and department via "users" with
    // just writing req.user.department since user is global variable we can use in both get and post request
    // but if we use hidden input it will only use in post request bcz input is empty till submit is clicked 
    // so these are three method to a sinngle thing ......
    var mydep = User.mydepartment();
    var myname = User.myname();    
    user.find({department: mydep})
    .then((found) => {
    for(let i =0;i< found.length ; i++)
        {
            var doc = {
                name: found[i].name,
                link: found[i].username + '.'+ myname
            }
            if(found[i].username !== myname)
                {
                    var flag = 1;
                    for(let j = 0;j<alluser.length;j++)
                        {
                            if(doc.name === alluser[j].name)
                                {
                                    flag = 0;
                                    break;
                                }
                        }
                    if(flag === 1)
                        {
                            alluser.push(doc);
                        }
                }
        }
    
})
Message.aggregate([
    {$match : {'receiverName': req.user.username}},
    {$sort: {'createdAt': -1}}
])
.then((found) => {
    res.render('private/chat',{alluser: alluser,mes: found});
})
    
})

router.get('/:link/',ensureAuthentication,(req,res) => {
        var alluser = [];
    var params = req.params.link.split('.');
    var nameParam = params[0];
    console.log(nameParam);
    var mydep = User.mydepartment();
    var myname = User.myname();    
    user.find({department: mydep})
    .then((found) => {
    for(let i =0;i< found.length ; i++)
        {
            var doc = {
                name: found[i].name,
                link: found[i].username + '.'+ myname
            }
            if(found[i].username !== myname)
                {
                    var flag = 1;
                    for(let j = 0;j<alluser.length;j++)
                        {
                            if(doc.name === alluser[j].name)
                                {
                                    flag = 0;
                                    break;
                                }
                        }
                    if(flag === 1)
                        {
                            alluser.push(doc);
                        }
                }
        }
    })
    var nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
    var noti = [];
    Message.find({$and : [{senderName: nameParam},{receiverName: req.user.username }]})
    .then((found) => {
        for(let i = 0; i< found.length; i++){
            found[i].isRead = false;
            found[i].save();
        }
    })
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
    .then((found) => {
        console.log(found);
    //{$and:[{'senderName': req.user.username},{'receiverName': req.user.username}]}
    
    Message.find({ $or : [
        {$and : [{senderName: req.user.username},{receiverName: nameParam}]},
        {$and : [{senderName: nameParam},{receiverName: req.user.username }]}
    ]})
    .sort({createdAt: 1})
    .then((result) => {
        console.log(result);
        res.render('private/private1',{alluser: alluser, result:result,mes: found});
    })
    //res.render('private/private1',{alluser: alluser});
})
});

router.post('/:name/', ensureAuthentication,(req,res,next) => {
    var params = req.params.name.split('.');
    var nameParam = params[0];
    var nameRegex = new RegExp("^" + nameParam.toLowerCase(), "i");
    console.log(nameRegex);
    if(req.body.message){
        user.findOne({'username': {$regex : nameRegex}})
            .then((found) => {
                var newMessage = new Message();
                newMessage.sender = req.user._id;
                newMessage.receiver = found._id;
                newMessage.message = req.body.message;
                newMessage.senderName = req.user.username;
                newMessage.receiverName = found.username;
                newMessage.createdAt = new Date();
                newMessage.save((err,result) => {
                    if(err)
                    {return next(err);}
                    else
                    {console.log(result);}
                })
            })
            res.redirect('/chat/' + req.params.name);
    }

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