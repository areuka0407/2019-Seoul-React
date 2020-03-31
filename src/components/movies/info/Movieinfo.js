import {useState} from 'react';
import Axios from 'axios';




export default function Movieinfo(props){
    const [moviedata, setMoviedata] = useState(props.moviedata);
    const [hiddenDescription, setHiddenDescription] = useState(true);
    const created_at = new Date(moviedata.date);

    function handleRecommend(video_idx){
        Axios.post("/api/recommends", {video_idx})
        .then(res => {
            let result = res.data.result;
    
            if(result){
                let moviedata = JSON.parse(JSON.stringify(moviedata));
                
            }
        });
    }

    return (
        <div>
            <div className="fx-4 font-weight-bold">{moviedata.title}</div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="fx-n2 text-muted mt-1">
                    <span>조회수 </span>
                    <span>{moviedata.view.toLocaleString()}</span>
                    <span className="ml-2">출품일 </span>
                    <span>{`${created_at.toLocaleDateString()}`}</span>
                </div>
                <div>
                    <button className="fx-n2 fill-btn" onClick={() => handleRecommend(props.idx)}>추천</button>
                    <button className="fx-n2 fill-btn ml-2">다운로드</button>
                </div>
            </div>
            <hr/>
            <div className="description mt-4 fx-n2">
                {moviedata.description}
            </div>
            {
                hiddenDescription ? 
                <div className="readmore mt-2 fx-n3" onClick={() => setHiddenDescription(false)}>더보기</div>
                : <div className="readmore mt-2 fx-n3" onClick={() => setHiddenDescription(true)}>간략히</div>
            }
            
            <style jsx>{`
                .readmore {
                    cursor: pointer;
                    user-select: none;
                }

                .description {
                    line-height: 1.8em;
                    height: ${hiddenDescription ? "5.4em" : "auto"};
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: ${hiddenDescription ? "3" : "none"};
                    -webkit-box-orient: vertical
                }
            `}</style>
        </div>
    )
}