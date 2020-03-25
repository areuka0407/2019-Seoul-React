import fs from 'fs';
import path from 'path';
import DB from '../../src/DB';

function randomStr(length = 30){
    const str = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let result = "";
    for(let i = 0; i < length; i++){
        result += str[parseInt(Math.random() * (str.length - 1))];
    }
    return result;
}

export default (req, res) => {
    if(req.method === "GET"){
        const {userId} = req.body;
        console.log(req.query.id);
        DB.find("users", {id: req.query.id})
        .then(user => {
            res.status(200).json(user);
        });
    }
    /**
     * 회원가입
     */
    else if(req.method === "POST"){
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

        console.log(DB.find);
        DB.find("users")
        .then(users => {
            console.log(users);
            return DB.insert(
                        "users", 
                        {
                            idx: users.length + 1,
                            id: userId,
                            password,
                            name,
                            follows: 0,
                            img: filename + fileExt
                        }
                    )
        })
        .then(result => {
            res.status(201).json(result);
        });
    }
}