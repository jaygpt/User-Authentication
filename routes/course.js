var express = require('express');
var router = express.Router();
var course = require('../models/course.js');

router.get('/:name/:id',(req,res)=>{
    res.render('index');
})

router.post('/:name/:id',(req,res)=>{
    var department = req.params.name;
    var type = req.params.id;
    var newCourse = new course({
        department: req.body.department,
       courseName: req.body.name,
       courseCode: req.body.code,
       prereq: req.body.prereq,
       details: req.body.details,
       type: req.body.type,
       way: req.body.way,
       resource: req.body.source,
    })
    newCourse.save();
    res.redirect('/course/' + department + '/' + type);
})
module.exports = router;