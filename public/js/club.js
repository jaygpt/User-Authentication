$(document).ready(function(){
    
    $('#favor'). on('submit',function(e){
        e.preventDefault();
        var id = $('#id').val();
        var clubName = $('#club_name').val();

        $.ajax({
            url: '/admin',
            post: 'POST',
            data: {
                id: id,
                clubName: clubName
            },
            success: function(){
                console.log(clubName);
            }
        })
    });
    
});