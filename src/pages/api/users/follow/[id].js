import User from 'models/user';

function pushRecommends(req, res){
    if(!req.session.user){
        res.status(403).send("로그인 후 이용하실 수 있습니다.");
        return;
    }

    const me = await User.findOne({idx: req.session.user.idx});
    const you = await User.findOne({idx: req.query.id});
    if(!me || !you){
        res.status(404).send("해당 유저를 찾을 수 없습니다.");
        return;
    }
    await me.addFollow(you);
    
    res.status(200).send("해당 배급사를 팔로우 하였습니다!"));
}

export default (req, res) => {
    switch(req.method){
        case "POST":
            pushRecommends(req, res);
            break;
        default: 
            res.status(404).send("해당 페이지는 존재하지 않습니다.")
    }
}