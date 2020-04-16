import Comment from '../../../../models/comment';

async function deleteComment(req, res){
    let comment = await Comment .findOne({idx: req.query.id})
                                .populate({path: "video", select: "user"});
    console.log("user:", req.session.user._id);
    console.log("comment:", comment);
    console.log("compare:", comment.video.user, req.session.user._id, comment.video.user != req.session.user._id)
    if(!comment){
        res.status(404).json("해당 덧글을 찾을 수 없습니다.");
    } else if(!req.session.user || (comment.user != req.session.user._id && comment.video.user != req.session.user._id)){
        res.status(404).json("해당 덧글을 삭제할 권한이 없습니다.");
    } else {
        await comment.remove();
        res.status(200).json("해당 덧글이 삭제되었습니다.");
    }
}

export default function (req, res){
    switch(req.method){
        case "DELETE": 
            deleteComment(req, res);
            break;
    }
}