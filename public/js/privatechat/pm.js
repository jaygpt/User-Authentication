$(document).ready(function () {
    var socket = io();
    $.deparam = $.deparam || function (uri) {
        console.log(uri);
        if (uri === undefined) {
            uri = window.location.pathname;
        }

        var value1 = window.location.pathname;
        var value2 = value1.split('/');
        var value3 = value2.pop();
        return value3;
    }
    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    var sendername = newParam[0];
    swap(newParam, 0 , 1);
    var paramtwo = newParam[0] + '.' + newParam[1];
    $('#namesender').text('@'+sendername);
    socket.on('connect', function(){
        var params = {
            room1 : paramOne,
            room2 : paramtwo
        }
        socket.emit('join',params,function(){
            console.log('USer joined');
        });        
    });

    socket.on('newmsg',function(data){
        console.log(data);
        var template = document.getElementById('messages');
        template.innerHTML +=  '<li class = "left"><span class = "chat-img1 pull-left"><img src="http://placehold.it/300x300" class="img-circle" alt=""></span><div class = "chat-body1"><span class="chat-name">' + data.sender + '</span><br>' + data.text + '</div></li>';

    })


    $('#message_form').on('submit',function(e){
        e.preventDefault();
        var msg = $('#msg').val();
        var sender = $('#name').val();
        
        if(msg.trim().length > 0){
            console.log('yes');
            socket.emit('PrivateMessage',{
                text: msg,
                sender: sender,
                room: paramOne
            },function(){
                $('#msg').val("");
            });
        }
        
    });

    $('#chatMessage').on('click',function(){
        var message = $('#msg').val();
        $.ajax({
            url : '/chat/' + paramOne,
            type: 'POST',
            data: {
                message: message
            },
            success : function(){
                $('#msg').val('');
            }
        })
    })
});

function swap(input, val_1, val_2)
{
    var temp = input[val_1];
    input[val_1] = input[val_2];
    input[val_2] = temp;
}
