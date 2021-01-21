[{
    id: '/#21jmfvjncmcjc',
    name: 'Idam',
    room: 'the office fans'
}]

//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)


class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var user = this.getUser(id);
        // return user that was remove
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0]
    }
    getUserList (room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);

        return namesArray;
    }
}


module.exports = {Users};

// class Person {
//     constructor (name, age) {
//         // console.log(name, age);
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription () {
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }

// var me = new Person('Idam', 29);
// var description = me.getUserDescription();
// console.log(description);