var mongoose = require('mongoose');
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
var videoSchema = new mongoose.Schema({
    idx: {type: Number, required: true, unique: true},
    title: String,
    description: String,
    date: Date,
    video: String,
    thumbnail: String,
    duration: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    view: Number,
    download: Number,
    allowed: Boolean,
    recommend: Number
});

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


var Video = connection.model('Video', videoSchema);
mongoose.model('Video', videoSchema);

module.exports = Video;