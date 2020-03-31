import {useState} from 'react';

function CommentForm(props){
    const [value, setValue] = useState('');

    function handleChange(e){
        setValue(e.target.value);
    }

    return (
        <form className={props.className}>
            <input type="text" placeholder="공개 댓글 추가…" value={value} onChange={handleChange} />
            <div className="mt-3">
                <button type="submit" className="fill-btn" disabled={value.length === 0 ? 'disabled' : ''}>댓글</button>
                <button type="reset" className="ml-2">취소</button>
            </div>
            <style jsx>{`
                input {
                    width: 100%;
                    border: none;
                    border-bottom: 1px solid #ccc;
                    outline: none;
                    font-size: 0.95em;
                    padding: 0.5em 0;
                    background-color: transparent;
                }

                button {
                    border: none;
                    padding: 0.5em 1.5em;
                    font-size: 0.9em;
                    user-select: none;
                }

                button[disabled]{
                    opacity: 0.6;
                    pointer-events: none;
                }
                

                button[type='reset'] {
                    background-color: #fff;
                    color: #222;
                    transition: 0.3s;
                }
                button[type='reset']:hover { background-color: #ddd; }


            `}</style>
        </form>
    )
}


function Comment(props){
    const commentData = props.data;
    const created_at = new Date(commentData.date);

    return (
        <div className="py-3 d-flex align-items-flex-start">
            <img src={"/images/profiles/" + commentData.user.img} alt="프로필 이미지"/>
            <div className="pl-4">
                <div>
                    <span className="font-weight-bold fx-n2">{commentData.user.name}</span>
                    <span className="fx-n4 ml-2 text-muted">{created_at.toLocaleDateString()}</span>
                </div>
                <div className="fx-n3 mt-1">
                    {commentData.comment}
                </div>
            </div>
            <style jsx>{`
                img {
                    flex: 0 0 80px;
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 1px solid #ddd;
                }
            `}</style>
        </div>
    )
}



export default function CommentArea(props){
    const {list} = props;
    const commentList = list
    .map(comment => {
        return <Comment key={comment.idx} data={comment} />;
    });

    return (
        <div>
            <div>댓글 {commentList.length.toLocaleString()}개</div>
            <CommentForm className="mt-3" />
            <div className="mt-4">
                {commentList}
            </div>
        </div>
    )
}