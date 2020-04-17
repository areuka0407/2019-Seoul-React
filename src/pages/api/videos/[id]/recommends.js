import User from '../../../../../models/user';
import Video from '../../../../../models/video';

async function addRecommends(req, res){
    if(!req.session.user){
        res.status(403).send("로그인 후 이용하실 수 있습니다.");
        return;
    }
    let user = await User.findOne({idx: req.session.user.idx});
    let video = await Video.findOne({idx: req.query.id});
    if(!video){
        res.status(404).send("해당 영상이 존재하지 않습니다.");
        return;
    }


    let [_video, _user] = await video.addRecommend(user);
    req.session.user = _user;

    res.status(200).json({
        message: "해당 영상을 추천하였습니다!",
        video: _video,
        user: _user
    });
}

async function removeRecommends(req, res){
    if(!req.session.user){
        res.status(403).send("로그인 후 이용하실 수 있습니다.");
        return;
    }
    let user = await User.findOne({idx: req.session.user.idx});
    let video = await Video.findOne({idx: req.query.id});
    if(!video){
        res.status(404).send("해당 영상이 존재하지 않습니다.");
        return;
    }

    let [_video, _user] = await video.removeRecommend(user);
    req.session.user = _user;

    res.status(200).json({
        message: "이제 이 영상은 추천영화 목록에서 볼 수 없을 겁니다!",
        video: _video,
        user: _user
    });
}

export default (req, res) => {
    switch(req.method){
        case "POST":
            addRecommends(req, res);
            break;
        case "DELETE":
            removeRecommends(req, res);
            break;
    }
}