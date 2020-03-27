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
var recommendSchema = new mongoose.Schema({
    idx: {type: Number, required: true, unique: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    video: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
});

/**
 * 플러그인 설정
 */

// auto-increment
recommendSchema.plugin(autoIncrement.plugin, {
    model: 'Recommend',
    field: 'idx',
    startAt: 1,
    increment: 1
});


var Recommend = connection.model('Recommend', recommendSchema);
mongoose.model('Recommend', recommendSchema);

module.exports = Recommend;