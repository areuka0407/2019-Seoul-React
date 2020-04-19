var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

let {toString} =  require('../helper');
require('./comment');


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
var videoSchema = new mongoose.Schema({
    idx: {type: Number, required: true, unique: true},
    title: String,
    description: String,
    date: Date,
    video: String,
    thumbnail: String,
    duration: Number,
    download: Number,
    allowed: Boolean,
    caption: String,
    recommends: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ],
    view: [ 
        new mongoose.Schema({
            date: Date,
            count: Number
        }, { _id: false })
    ],
});

videoSchema.methods.addComment = function(comment){
    this.comments.push(comment);
    return this.save();
}

videoSchema.methods.addRecommend = async function(user){
    if(!this.recommends.includes(user._id))
        this.recommends.push(user);
    if(!user.recommends.includes(this._id))
        user.recommends.push(this);
    
    await Promise.all([this.save(), user.save()]);
    return [this, user];
}

videoSchema.methods.removeRecommend = async function(user){
    let videoIdx = this.recommends.findIndex(r => toString(r) == user._id);
    let userIdx = user.recommends.findIndex(r => toString(r) == this._id);

    if(videoIdx >= 0) this.recommends.splice(videoIdx, 1);
    if(userIdx >= 0) user.recommends.splice(userIdx, 1);

    await Promise.all([this.save(), user.save()]);
    return [this, user];
}

videoSchema.methods.addView = function(increase = 1, standard = new Date()){
    if(standard instanceof Date == false) standard = new Date(standard);

    let firstDay = new Date(standard.getFullYear(), standard.getMonth(), 1, 9, 0, 0, 0);
    let idx = this.view.findIndex(v => v.date <= firstDay && v.date >= firstDay);

    if(idx < 0){
        this.view.push({ date: firstDay, count: increase });
    }
    else {
        this.view[idx].count += increase;
    }
    return this.save();
}


/**
 * 플러그인 설정
 */

// auto-increment
videoSchema.plugin(autoIncrement.plugin, {
    model: 'Video',
    field: 'idx',
    startAt: 1,
    increment: 1
});

connection.model('Video', videoSchema);

var Video;
if(mongoose.models.Video) 
    Video = mongoose.model("Video");
else    
    Video = mongoose.model('Video', videoSchema);

module.exports = Video;