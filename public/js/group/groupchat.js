//client side server
$(document).ready(function(){
    var socket = io.connect();
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    socket.on('connect',function(){
        console.log('Yea: connection is done');
        
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join',params,function(){
            console.log('user connected to this channels');
        });
    });
    
    socket.on('userslist',function(users){
        var add = document.getElementById('users');
        var number = 0;
        for(var i=0;i< users.length;i++)
            {
                console.log(users[i]);
                add.innerHTML += '<ol><a id = "val" data-toggle = "modal" data-target = "myModal">' + users[i] + '</ol></a>';
                number++;
            }
        var num = document.getElementById('numValue');
        num.innerHTML = '<p>(' + number + ')</p>';
    });
    
    socket.on('newMessage', function(data){
        console.log(data);
        /*var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        console.log(template);
        $('#messages').append(message);
        
        var template = $('#message-template').html();
        var templateScript = Handlebars.compile(template);
        var context = {"sender":"naman","Text":"Bureaucrate"}
        var html = templateScript(context);
        $('#messages').append(html);
        */
        console.log(data.sender);
        var template = document.getElementById('messages');
        template.innerHTML +=  '<li class = "left"><span class = "chat-img1 pull-left"><img src="http://placehold.it/300x300" class="img-circle" alt=""></span><div class = "chat-body1"><span class="chat-name">' + data.from + '</span><br>' + data.text + '</div></li>';
    });
   
    $('#message-form').on('submit',function(e){
        e.preventDefault();
        var msg = $('#msg').val();
        socket.emit('createMessage',{
            text: msg,
            room: room,
            sender: sender,
            
        }, function(){
            //this id to remove data from input field
            $('#msg').val('');
        });
    });
    
});