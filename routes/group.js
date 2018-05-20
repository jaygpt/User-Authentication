var express = require('express');
var router = express.Router();
var club = require('../models/club');
router.get('/:name',function(req,res){
    var groupname = req.params.name;
    var message = [];
    club.findOne({name: groupname})
                .then((found) => {
                for(let i =0;i<found.post.length;i++)
                    {
                        console.log(found.post[i]);
                        var obj = found.post[i];
                        message.push(obj);
                    }
            })
    console.log(message);
    res.render('groupchat/groupchat', {groupName:groupname,message: message});
});
/*
function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}
*/
module.exports = router;