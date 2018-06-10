const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const answers = new Schema({
    user: {
        //type: Schema.Types.ObjectId,ref: 'User'},
        type: String,
    },
    body:{
        type: String
    },
    file:{
        type: String
    }
});
module.exports = mongoose.model('answers',answers);