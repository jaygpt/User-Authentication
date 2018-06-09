const express = require('express');
const router = express.Router();
const course = require('../models/coursera');
const User = require("../models/user");
router.get('/',function(req,res){
    res.render('admin/course/course');
});
router.post('/:id',function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
        const Course = new course({
            course: req.body.course
        });
        Course.save().then(function(result){
            req.flash('course_added',req.body.course+" is added to the course list")
            res.redirect('/doubt');
        })
    })
    
})
module.exports = router;