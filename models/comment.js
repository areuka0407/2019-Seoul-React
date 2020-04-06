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
var commentSchema = new mongoose.Schema({
    idx: {type: Number, required: true, unique: true},
    comment: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: Date,
});

/**
 * 플러그인 설정
 */

// auto-increment
commentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'idx',
    startAt: 1,
    increment: 1
});

connection.model('Comment', commentSchema);

let Comment;
if(mongoose.models.Comment)
    Comment = mongoose.model("Comment");
else
    Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;