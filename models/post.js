const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    sender: String,
    message : String,
    image: {
        type: String,
        default: null
    }
});

module.exports = postSchema;