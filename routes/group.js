var express = require('express');
var router = express.Router();

router.get('/:name',function(req,res){
    var groupname = req.params.name;
    res.render('groupchat/groupchat',{name:groupname});
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