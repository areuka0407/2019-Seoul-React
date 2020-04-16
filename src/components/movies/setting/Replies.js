import {useState} from 'react';
import {createToast} from '../../../../helper';
import Axios from 'axios';

function Comment(props){
    const {info, onClick} = props;
    const created_at = new Date(info.date);

    return  <div className="py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex">
                    <div className="profile-image">
                        <img src={"/images/profiles/" + info.user.img} alt={info.user.name + "님의 프로필 사진"}/>
                    </div>
                    <div className="pl-4">
                        <div>
                            <span className="font-weight-bold fx-n2">{info.user.name}</span>
                            <span className="fx-n4 ml-2 text-muted">{created_at.toLocaleTimeString()}</span>
                        </div>
                        <div className="fx-n3 mt-1">
                            {info.comment}
                        </div>
                    </div>
                </div>
                <div className="ml-3">
                    <button className="fill-btn fx-n3" onClick={onClick}>삭제</button>
                </div>
                <style jsx>{`
                    .profile-image {
                        border-radius: 50%;
                        flex: 0 0 64px;
                        width: 64px;
                        height: 64px;
                        overflow: hidden;
                    }    

                    .profile-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }

                    button {
                        width: 50px;
                    }
                `}</style>
            </div>
}

export default function Replies(props){
    const {movie} = props;
    const [comments, setComments] = useState(movie.comments);

    const handleClick = idx => {
        Axios.delete("/api/comments/" + idx)
        .then(res => {
            if(res.status !== 200) createToast("댓글 삭제 실패...", res.data);
            else {
                const _comments = JSON.parse(JSON.stringify(comments));
                let itemIndex = _comments.findIndex(item => item.idx === idx);
                _comments.splice(itemIndex, 1);
                setComments(_comments);

                createToast("댓글 삭제 성공!", res.data);
            }
        })
    }

    return  <div className="d-flex flex-column">
                {comments.map(comment => <Comment key={comment.idx} info={comment} onClick={() => handleClick(comment.idx)} />)}
            </div>
}