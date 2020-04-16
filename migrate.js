require('./database');
require('./passport');

const {users, videos, follow, comments, recommends, view_history} = require('./public/json/data.json');
const User = require('./models/user');
const Video = require('./models/video');
const Comment = require('./models/comment');

/**
 * Users
 */

 Promise.all(
     users.map(user => {
        let pw = user.password;
        delete user.password;
        delete user.follows;

        let vidoes = [], following = [], recommends = [];

        return User.register(new User({vidoes, following, recommends, ...user}), pw);
     })
 ).then(() => {
   console.log("유저 삽입 완료!");
   return Promise.all(
      videos.map(async video => {
         let comments = [], view = [];
         let user = await User.findOne({idx: video.users_id});
         let caption = video.caption ? video.caption : null;

         delete video.caption;
         delete video.view;
         delete video.users_id;
         delete video.Recommend;

         let new_video = new Video({user, view, comments, caption, ...video});
         await user.addVideo(new_video);
         await new_video.save();
      })
   )
 }).then(() => {
   console.log("비디오 삽입 완료!");
   return Promise.all(
      follow.map(async fdata => {
         const user = await User.findOne({idx: fdata.follower});
         const target = await User.findOne({idx: fdata.user_idx});
         await user.addFollow(target);
      })
   )
 }).then(() => {
    console.log("팔로우 삽입 완료!");
    return Promise.all(
      comments.map(async ({idx, comment, user_idx, video_idx, date}) => {
         const video = await Video.findOne({idx: video_idx});
         const user = await User.findOne({idx: user_idx});

         let new_comment = new Comment({idx, comment, user, date, video});;
         await new_comment.save();

         await video.addComment(new_comment);
      })
   )
 }).then(() => {
   console.log("코멘트 삽입 완료!");
   return Promise.all(
      recommends.map(async ({user_idx, video_idx}) => {
         const user = await User.findOne({idx: user_idx});
         const video = await Video.findOne({idx: video_idx});

         await video.addRecommend(user);
      })
   )
 }).then(() => {
    console.log("추천 데이터 삽입 완료!");
    return Promise.all(
      view_history.map(async ({video_idx, date, increase}) => {
         const video = await Video.findOne({idx: video_idx});
         await video.addView(increase, date);
      })
   )
 }).then(() => {
   console.log("조회수 데이터 삽입 완료!");
 }).catch(err => {
    console.log("뭔가 에러가 떴다!", err);
 });
