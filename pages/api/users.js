import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import DB from '../../src/DB';

function randomStr(length = 30){
    const str = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let result = "";
    for(let i = 0; i < length; i++){
        result += str[parseInt(Math.random() * (str.length - 1))];
    }
    return result;
}


/**
 * 아이디로 유저 가져오기
 */

 function getUserById(req, res){
    DB.find("users", {id: req.query.id}).then(user => {
        res.status(200).json(user);
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

    // 패스워드 암호화
    let salt = Math.floor(new Date().getTime() * Math.random()) + "";
    let hashedPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

    console.log({password, salt, hashedPassword});

    //DB 삽입
    DB.insert(
        "users", 
        {
            id: userId,
            password: hashedPassword, 
            salt,
            name,
            follows: 0,
            img: filename + fileExt
        }
    )
    .then(result => {
        res.status(201).json(result);
    });
}

export default (req, res) => {
    if(req.method === "GET"){

        if(typeof req.query.id !== 'undefined') {
            getUserById(req, res);
        }

    }
    else if(req.method === "POST"){
        signUp(req, res);
    }
}