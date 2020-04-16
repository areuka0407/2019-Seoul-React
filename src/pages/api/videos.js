import Video from '../../../models/video';
import User from '../../../models/user';

function getVideo(req, res){
    Video.findOne({idx: req.query.id})
    .populate("user")
    .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "id name img",
        }
    })
    .exec((err, video) => {
        if(err) 
            res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
        else 
            res.status(200).json({result: true, video});
    });
}

function getVideoList(req, res){
    Video.find()
    .populate("user")
    .exec((err, videoList) => {
        if(err) 
            res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
        else 
            res.status(200).json({result: true, videoList});
    });
}

function getVideoListByUser(req, res){
    User.findOne({idx: req.query.user})
    .then(user => {
        Video.find({user})
        .populate("user")
        .exec((err, videoList) => { 
            if(err) 
                res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
            else 
                res.status(200).json({result: true, videoList});
        });
    });
}

function getVideoListOnlyMine(req, res){
    if(!req.session.user){
        res.status(200).json({videoList: []});
    }
    else {
        Video.find({user: req.session.user})
        .populate('user')
        .exec((err, videoList) => {
            if(err) 
                res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
            else 
                res.status(200).json({result: true, videoList});
        });

    }
}

function insertVideo(req, res){
    console.log(req.body, req.files);
    res.status(400).json(req.body);
}

export default (req, res) => {
    switch(req.method){
        case "GET": 
            if(req.query.id)  
                getVideo(req, res);
            else if(req.query.user)
                getVideoListByUser(req, res);
            else if(req.query['only-mine'])
                getVideoListOnlyMine(req, res);
            else
                getVideoList(req, res);
            break;
        case "POST":
            insertVideo(req, res);
    }
};  