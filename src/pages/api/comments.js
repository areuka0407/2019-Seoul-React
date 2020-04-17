import Video from '../../../models/video';
import Comment from '../../../models/comment';
import User from '../../../models/user';

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

async function insertComment(req, res){
    const {text, video_id} = req.body;
    const user = req.session.user;
    const date = new Date();

    if(!user){
        res.status(200).json({comment: null, message: "로그인 된 사용자만 댓글을 작성하실 수 있습니다."});
        return;
    }
    else if(text.trim() === ""){
        res.status(200).json({comment: null, message: "댓글을 입력해 주세요."});
    }
    

    let video = await Video.findOne({idx: video_id});

    let comment = new Comment();
    comment.comment = text;
    comment.user = user;
    comment.date = date;
    comment.video = video;
    await comment.save();

    await video.addComment(comment);

    // 복사본을 Response 하도록
    let _comment = Object.assign({}, comment._doc);
    _comment.user = await User.findOne({_id: comment.user});
    
    res.status(200).json({
        comment: _comment
    });
}

export default (req, res) => {
    if(req.method === "GET") {
        getCommentList(req, res);
    }
    else if(req.method === "POST"){
        insertComment(req, res);
    }
}