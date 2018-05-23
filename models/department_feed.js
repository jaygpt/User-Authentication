var mongoose = require('mongoose');
var feeds = require('./feeds');

var department_feed = mongoose.Schema({
	   department: {
           type: String
       },
       feeds : [feeds]
    }
});

module.exports = department_feed;
