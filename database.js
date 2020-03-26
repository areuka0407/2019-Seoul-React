// 몽고 디비 설정
const mongoose = require('mongoose');
mongoose.connect(
  // mongodb://{host}:{port}/{dbname}
  'mongodb://localhost:27017/biff2019',  
  // 아래 옵션들을 사용하지 않으면 deprecatedError 에러가 발생
  { 
    useNewUrlParser: true,    
    useFindAndModify: false,
    useUnifiedTopology: true 
  }
)