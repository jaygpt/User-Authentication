var mongoose = require('mongoose');
var feeds = require('./feeds');
var Schema = mongoose.Schema;
var department_feed = new Schema({
	   department: String,
       feeds : [feeds]
    }
);

module.exports = mongoose.model('department_feed', department_feed);
