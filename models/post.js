const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    sender: String,
    message : String
});

module.exports = postSchema;