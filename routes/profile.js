const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {isEmpty} = require('../helpers/uploadhelper');
const upload = require('express-fileupload');

/* router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
}); */
router.get('/',function(req,res){
    res.render('admin/profile/profile');
});
router.get('/profileedit',function(req,res){
    res.render('admin/profile/profileedit');
});
router.use(upload());
router.put('/profileedit/:id',function(req,res){
    let filename = '';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + file.name;
        file.mv('./public/uploads/'+filename,function(err){
            if(err) return err;
        });
        User.findOne({_id: req.params.id}).then(function(user){
            user.profile.image = filename;
            user.club = req.body.club;
            user.profile.bio = req.body.bio;
            user.profile.room = req.body.room;
            user.profile.club = req.body.club;
            user.profile.position = req.body.clubp;
            user.profile.project = req.body.project;
            user.profile.clubi = req.body.clubi;
            user.profile.pastprojects = req.body.pastprojects;
            user.profile.intern = req.body.intern;
            user.profile.sports = req.body.sports;
            user.save().then(function(updatedData){
                res.redirect('/profile');
            }).catch(function(err){
                return err;
            });
        });
    }else{
        User.findOne({_id: req.params.id}).then(function(user){
            user.profile.image = req.body.image;
            user.club = req.body.club;
            user.profile.bio = req.body.bio;
            user.profile.room = req.body.room;
            user.profile.club = req.body.club;
            user.profile.position = req.body.clubp;
            user.profile.project = req.body.project;
            user.profile.clubi = req.body.clubi;
            user.profile.pastprojects = req.body.pastprojects;
            user.profile.intern = req.body.intern;
            user.profile.sports = req.body.sports;
            user.save().then(function(updatedData){
                res.redirect('/profile');
            }).catch(function(err){
                return err;
            });
        });
    }; 
});
module.exports = router;