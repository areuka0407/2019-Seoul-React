require('./database');
require('./passport');

const Video = require("./models/video");

Video.findOne().then(video => {
    console.log(video);
});