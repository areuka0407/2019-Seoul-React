const DB = require('./src/DB');
// const crypto = require('crypto');


// DB.find("users")
// .then(userList => {
//     userList.forEach(user => {
//         user.salt = Math.floor(new Date().getTime() * Math.random()) + "";
//         user.password = crypto.createHash('sha512').update(user.password + user.salt).digest('hex');
//         DB.update("users", user, {idx: user.idx});
//     });
// });

DB.insert("users", {
    name: "김민재",
    password: "1234",
    id: "125"
})