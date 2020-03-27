const mongoose = require('mongoose');
 
const followSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},  // '팔로우'를 누른 사람
    following: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // '팔로우'를 받은 사람
});

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;