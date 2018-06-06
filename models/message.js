var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    message: {type: String},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    senderName: {type: String},
    receiverName: {type: String},
    // this is to be done when we upload a image in user
    //userImage: {type: String, default: 'defaultPic.png'},
    isRead: {type:Boolean, default:true},
    createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);