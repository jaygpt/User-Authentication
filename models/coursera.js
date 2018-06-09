const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const coursera = new Schema({
    course:{
        type: String
    }
});
module.exports = mongoose.model('Coursera',coursera);