import Video from '../../../models/video';
import Comment from '../../../models/comment';

async function getCommentList(req, res){
    let video = await Video.findOne({idx: req.query.video});
    
    if(!video) {
        res.status(200).json({commentList: []});
    }
    else {
        let list = await Comment.find({video: video._idx});
        res.status(200).json({commentList: list});
    }
}

export default (req, res) => {
    if(req.method === "GET") {
        getCommentList(req, res);
    }
    else if(req.method === "POST"){

    }
}