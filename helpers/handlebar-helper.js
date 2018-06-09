module.exports={
    select: function(selected,options){
        return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'),'$&selected="selected"');
    },
    empty: (name, options) => {
        if(name == "no"){
            return options.inverse(this);
        }
        else{
            return options.fn(this);
        }
    },
    isequal: function(a,b,options){
        if(a==b){
            return options.fn(this);
        }
        else{
            return options.inverse(this);
        }
    }
}