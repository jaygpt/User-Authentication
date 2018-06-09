var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var course = new Schema({
	   department: String,
       courseName: String,
       courseCode: String,
       prereq: String,
       details: String,
       way:String,
       resource: String,
       type:String
    }
);

module.exports = mongoose.model('course', course);