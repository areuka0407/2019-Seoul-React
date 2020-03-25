// const DB = require('./src/DB');

// DB.find("users", {'idx': 1}).then(async item => {
//     const {id, password, name, follows, img} = item[0];
//     const copy = {idx: 17, id, password, name, follows, img};
//     const result = await DB.insert("users", copy).result;
//     console.log(result);
// });

// DB.update(
//     "users", 
//     { name: "기능반" },
//     {idx : 17}
// );


// DB.delete("users", {idx: 17});