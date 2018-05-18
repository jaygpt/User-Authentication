class Users {
    constructor(){
        this.users = [];
    }
    ///method
    AddUserData(id,name,room){
        var users = {
            id: id,
            name: name,
            room:room
        };
        this.users.push(users);
        return users;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.users.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    GetUserList(room){
        //new array
        var users = this.users.filter((user) => {
            return user.room === room;
        });
        //new array
        var nameArray = users.map((user) => {
            return user.name;
        })
        
        return nameArray;
    }
}

module.exports = {Users};