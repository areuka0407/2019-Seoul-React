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
    follows: { type: Number, default: 0 },
    img: { type: String, required: true },
});


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

var User = connection.model('User', userSchema);
mongoose.model('User', userSchema);

module.exports = User;