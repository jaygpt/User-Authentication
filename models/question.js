const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const question = new Schema({
    course:{
        type: Schema.Types.ObjectId,
        ref: 'Coursera'
    },
    question:{
        type: String
    },
    file:{
        type: String
    },
    date :{
        type: Date,
        default: Date.now()
    },
    name:{
        type:String
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'answers'
    }]
});
module.exports = mongoose.model('question',question);