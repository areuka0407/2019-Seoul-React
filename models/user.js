var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('useCreateIndex', true);

/**
 * Auto-increment 설정
 */
// autoIncrement 사용을 위한 multiple connection 사용
var connection = mongoose.createConnection("mongodb://localhost:27017/biff2019", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
});
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

/**
 * 스키마 설정
 */
var userSchema = new mongoose.Schema({
    idx: {type: Number, required: true, unique: true},
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true },
    img: { type: String, required: true },
    videos: [ { type: mongoose.Schema.Types.ObjectId, ref: "Video" } ],
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    follower: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    recommends: [ { type: mongoose.Schema.Types.ObjectId, ref: "Video" } ],
    created_at: { type: Date, default: new Date() }
});

// 비디오 추가
userSchema.methods.addVideo = function(video){
    this.videos.push(video);
    return this.save();
}

// 팔로잉
userSchema.methods.addFollow = function(user){
    if(!this.following.includes(user._id)) 
        this.following.push(user);
    if(!user.follower.includes(this._id)) 
        user.follower.push(this);

    return Promise.all([this.save(), user.save()]);
}

// 언팔로우
userSchema.methods.removeFollow = function(user){
    let indexMe = this.following.findIndex(f => f == user._id);
    let indexYou = user.follower.findIndex(f => f == this._id);

    if(indexMe >= 0) this.following.splice(indexMe, 1);
    if(indexYou >= 0) user.follower.splice(indexYou, 1);

    return Promise.all([this.save(), user.save()]);
}


/**
 * 플러그인 설정
 */

// auto-increment
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'idx',
    startAt: 1,
    increment: 1
});

// passport
userSchema.plugin(passportLocalMongoose, { usernameField: 'id' });
connection.model('User', userSchema);


var User;
if(mongoose.models.User) 
    User = mongoose.model("User");
else 
    User = mongoose.model('User', userSchema);

module.exports = User;
