import Recommend from '../../../models/recommend';

function getListOnlyMine(req, res){
    if(!req.session.user) 
        res.status(200).json({recommendList: [], message: "로그인 되어있지 않습니다."});
    else {
        Recommend.find({user: req.session.user})
        .populate("video")
        .populate("user")
        .exec((err, recommendList) => {
            if(err)
                res.status(200).json({message: "데이터를 불러오지 못했습니다.", recommendList: []});
            else
                res.status(200).json({recommendList});
        });
    }
}


export default (req, res) => {
    switch(req.method){
        case "GET":
            if(req.query['only-mine']){
                getListOnlyMine(req, res);
                break;
            }
        default: res.status(404).json({message: "올바른 요청이 아닙니다.", result: false});
    }
};