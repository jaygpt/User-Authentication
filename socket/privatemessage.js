module.exports = function(io){
    io.on('connection', (socket) => {
        socket.on('join',(pm,callback) => {
            console.log('yes');
            socket.join(pm.room1);
            socket.join(pm.room2);
            callback();
        });
        socket.on('PrivateMessage',function(message,callback){
            io.to(message.room).emit('newmsg',{
                text: message.text,
                sender: message.sender
            });

            callback();
        });
        socket.on('disconnect',() => {
            socket.disconnect();
        })
    });
}