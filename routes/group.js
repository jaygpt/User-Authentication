var express = require('express');
var router = express.Router();
var club = require('../models/club');
var Message = require('../models/message');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');

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

router.get('/',ensureAuthentication,(req,res) => {
    var resl = [];
        club.find({})
                .then((found) => {
                console.log(found);
                for(let i = 0 ; i<found.length ; i++)
                    {
                        for(let j = 0; j<found[i].fans.length ; j++)
                            {
                                if(found[i].fans[j].username  == req.user.username)
                                    {
                                        resl.push(found[i]);
                                    }
                            }
                    }                
    })
    console.log(resl);
    res.render('groupchat/groupshow',{resl: resl});
});

router.get('/:name',ensureAuthentication,function(req,res){
    var groupname = req.params.name;
    var message = [];
    club.findOne({name: groupname})
                .then((found) => {
                    var myname = req.user.username;
                for(let i =0;i<found.post.length;i++)
                    {
                        //console.log(found.post[i]);
                        var isTrue = true;
                        if(found.post[i].sender === myname)
                        {
                            isTrue = false;
                        }
                        console.log(isTrue);
                        var obj = { 
                            image: found.post[i].image,
                            isUser: isTrue,
                            _id: found.post[i]._id,
                            sender: found.post[i].sender,
                            message: found.post[i].message
                         }
                        message.push(obj);
                    }
                    //console.log(message);
            })
            Message.aggregate([
                {$match : {'receiverName': req.user.username}},
                {$sort: {'createdAt': -1}},
                /* {
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
                } */
            
            ])
            .then((noti)=>{
                console.log(noti);
                res.render('groupchat/groupchat', {groupName:groupname, message: message, mes: noti});
            })
});
router.get('/:gname/fileupload/:uname',ensureAuthentication,function(req,res){
    var groupname = req.params.gname;
    var username = req.params.uname;
    res.render('fileupload');
});
router.post('/:gname/fileupload/:uname',ensureAuthentication,function(req,res){
    var groupname = req.params.gname;
    var username = req.params.uname;
    upload(req,res,(err) => {
        if(err){
            res.render('index',{msg: err});
        }
        else{
            club.findOne({name:groupname})
            .then((myclub) => {
                var newimg = {
                    sender: username,
                    message: '',
                    image: req.file.filename
                }
                myclub.post.push(newimg);
                myclub.save();
            })
            console.log(req.file);
        }
    })
    res.redirect('../');
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