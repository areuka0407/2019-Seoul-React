import fs from 'fs';
import path from 'path';
import User from '../../../models/user';

function randomStr(length = 30){
    const str = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let result = "";
    for(let i = 0; i < length; i++){
        result += str[parseInt(Math.random() * (str.length - 1))];
    }
    return result;
}

/**
 * 유저 목록 가져오기
 */

function getUserList(req, res){
    User.find()
    .then(userList => {
        res.status(200).json({userList});
    });
}


/**
 * 아이디로 유저 가져오기
 */

 function getUserById(req, res){
    User.findOne({id: req.query.id})
        .populate("videos")
        .exec((err, user) => {
            res.status(200).json({user});
        });
 }

 /**
  * 인덱스로 유저 가져오기
  */

  function getUserByIdx(req, res){
    User.findOne({idx: req.query.idx})
    .populate("videos")
    .exec((err, user) => {
        res.status(200).json({user});
    });
  }


/**
 * 회원가입
 */
function signUp(req, res){
    const { userId, password, name, profile } = req.body;
    const root = process.env.ROOT;
    const savePath = path.join(root, "public", "images", "profiles");
    
    // 이미지 업로드
    let profileList = fs.readdirSync(savePath)

    let matches = profile.match(/data:image\/(?<ext>jpeg|png);base64,(?<data>.+)/);
    let profileData = matches.groups.data;
    let fileExt = "." + matches.groups.ext;

    let filename = randomStr(20);
    
    while(profileList.includes(filename + fileExt)){
        filename = randomStr(20);
    }
        
    const saveName = path.join(savePath, filename + fileExt);
    fs.writeFileSync(saveName, profileData, 'base64');


    //DB 삽입
    const userInfo = { id: userId, name, follows: 0, img: filename + fileExt, videos: [], following: [], follower: [], recommends: [] };
    User.register(new User(userInfo), password, err => {
        if(err) {
            res.status(200).json({result: false});
            console.log("회원가입 도중 에러 발생!", err);
        }
        else res.status(200).json({result: true});
    });
}

export default (req, res) => {
    if(req.method === "GET"){
        if(typeof req.query.id !== 'undefined') {
            getUserById(req, res);
        }
        else if(typeof req.query.idx !== 'undefined'){
            getUserByIdx(req, res);
        }
        else {
            getUserList(req, res);
        }

    }
    else if(req.method === "POST"){
        signUp(req, res);
    }
}