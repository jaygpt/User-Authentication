var club = require('../models/club');
var multer = require('multer');
module.exports = function(io, Users){
    
    const users = new Users();
    io.on('connection',(socket) => {
        console.log('user connected from server');
        
        socket.on('join', (params,callback) => {
            socket.join(params.room);
            users.AddUserData(socket.id,params.name,params.room);
            io.to(params.room).emit('userslist',users.GetUserList(params.room));
            callback();
        })
        
        socket.on('createMessage',(message, callback) => {
            var room = message.room;
            club.findOne({name: room})
                .then((found) => {
                found.post.push({sender: message.sender,message: message.text});
                found.save();
                //console.log(found);
            })
             //we will use high promise here
            
            io.to(message.room).emit('newMessage',{
                 text: message.text,
                 room: message.room,
                from: message.sender,
                
            });
            callback();
        });
        
        socket.on('disconnect',()=> {
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('usersList', users.GetUserList(user.room));
            }
        })
        
    });
}