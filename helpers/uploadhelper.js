module.exports={
    select: function(selected,options){
        return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'),'$&selected="selected"');
    },
    isEmpty: function(obj){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    },
    empty: function(name, options){
        if(name == "no"){
            return options.inverse(this);
        }
        else{
            return options.fn(this);
        }
    }
}