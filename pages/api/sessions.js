import DB from '../../src/DB';
import crypto from 'crypto';

async function isLogin(req, res){
    let uid = typeof req.session.uid !== 'undefined' ? req.session.uid : false;
    let user = await DB.find("users", {idx: uid});
    user = user.length > 0 ? user[0] : false;

    res.status(200).json(user);
}

async function signIn(req, res){
    const {userId, password} = req.body;
    
    let sameId = await DB.find("users", {id: userId});
    let hashedInputPW = sameId.length > 0 && crypto.createHash('sha512').update(password + sameId[0].salt).digest('hex');

    if(sameId.length === 0) { 
        res.status(200).json({type: "danger", message: "입력 정보와 일치하는 회원을 찾을 수 없습니다."}) 
    } else if(sameId[0].password !== hashedInputPW) {
        res.status(200).json({type: "danger", message: "비밀번호가 일치하지 않습니다."}) 
    } else {
        req.session.uid = sameId[0].idx;
        res.status(200).json({type: "primary", message: "로그인 되었습니다! 환영합니다!"});
    }
}


export default (req, res) => {
    
    switch(req.method){
        case "GET": isLogin(req, res); break;
        case "POST": signIn(req, res); break;
    }
};  