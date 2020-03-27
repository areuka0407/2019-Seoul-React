require('./database');
require('./passport');

const {users, videos, follow, comments, recommends, view_history} = require('./public/json/data.json');
const User = require('./models/user');
const Video = require('./models/video');
const Follow = require('./models/follow');
const Comment = require('./models/comment');
const Recommend = require('./models/recommend');
const ViewHistory = require('./models/view-history');


/**
 * Users
 */

 Promise.all(
     users.map(user => {
        let pw = user.password;

        delete user.password;
        // delete user.idx;

        return User.register(new User(user), pw);
     })
 ).then(() => {
   console.log("유저 삽입 완료!");
   return Promise.all(
      videos.map(async video => {
         let user = await User.findOne({idx: video.users_id});
         video.user = user._id;

         delete video.users_id;

         return Video.create(video);
      })
   )
 }).then(() => {
   console.log("비디오 삽입 완료!");
   return Promise.all(
      follow.map(async fdata => {
         const user = await User.findOne({idx: fdata.follower});
         const following = await User.findOne({idx: fdata.user_idx});
 
         return Follow.create({user, following});
      })
   )
 }).then(() => {
    console.log("팔로우 삽입 완료!");
    return Promise.all(
      comments.map(async ({idx, comment, user_idx, video_idx, date}) => {
         const user = await User.findOne({idx: user_idx});
         const video = await Video.findOne({idx: video_idx});

         return Comment.create({idx, comment, user, video, date});
      })
   )
 }).then(() => {
   console.log("코멘트 삽입 완료!");
   return Promise.all(
      recommends.map(async ({idx, user_idx, video_idx}) => {
         const user = await User.findOne({idx: user_idx});
         const video = await Video.findOne({idx: video_idx});
  
         return Recommend.create({idx, user, video});
      })
   )
 }).then(() => {
    console.log("추천 데이터 삽입 완료!");
    return Promise.all(
      view_history.map(async ({idx, video_idx, date, increase}) => {
         const video = await Video.findOne({idx: video_idx});

         return ViewHistory.create({idx, video, date, increase});
      })
   )
 }).then(() => {
   console.log("조회수 데이터 삽입 완료!");
 }).catch(err => {
    console.log("뭔가 에러가 떴다!", err);
 });



/**
 * Videos
 */

// Promise.all(
//     videos.map(async video => {
//         let user = await User.findOne({idx: video.users_id});
//         video.user = user._id;

//         delete video.users_id;

//         return Video.create(video);
//     })
// ).then(() => {
//     console.log("Video 삽입 완료 !");
// }).catch(err => {
//     console.log("이게 무슨 에러지 ? ", err);
// });


/**
 * poulate 예제
 */

// Video.findOne({idx: 1})
// .populate('user')
// .exec((err, data) => {
//     if(err) console.log("무슨 에러지?", err);
//     console.log(data);
// });

/**
 * Follow
 */

//  Promise.all(
//      follow.map(async fdata => {
//         const user = await User.findOne({idx: fdata.follower});
//         const following = await User.findOne({idx: fdata.user_idx});

//         return Follow.create({user, following});
//      })
//  ).then(() => {
//     console.log("팔로우 데이터 삽입 완료!");
//  }).catch(err => {
//     console.log("팔로우 삽입 에러 : ", err);
//  });

/**
 * Comment
 */

//  Promise.all(
//      comments.map(async ({idx, comment, user_idx, video_idx, date}) => {
//         const user = await User.findOne({idx: user_idx});
//         const video = await Video.findOne({idx: video_idx});

//         return Comment.create({idx, comment, user, video, date});
//      })
//  ).then(() => {
//     console.log("코멘트 데이터 삽입 완료!");
//  }).catch(err => {
//     console.log("코멘트 삽입 에러 : ", err);
//  });

/**
 * Recommend
 */

// Promise.all(
//     recommends.map(async ({idx, user_idx, video_idx}) => {
//        const user = await User.findOne({idx: user_idx});
//        const video = await Video.findOne({idx: video_idx});

//        return Recommend.create({idx, user, video});
//     })
// ).then(() => {
//    console.log("추천 데이터 삽입 완료!");
// }).catch(err => {
//    console.log("추천 삽입 에러 : ", err);
// });

/**
 * View History
 */

// Promise.all(
//     view_history.map(async ({idx, video_idx, date, increase}) => {
//        const video = await Video.findOne({idx: video_idx});

//        return ViewHistory.create({idx, video, date, increase});
//     })
// ).then(() => {
//    console.log("조회수 데이터 삽입 완료!");
// }).catch(err => {
//    console.log("조회수 삽입 에러 : ", err);
// });