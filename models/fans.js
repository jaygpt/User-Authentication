const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fans = new Schema({
    username: String,
    email : String
});

module.exports = fans;