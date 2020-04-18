import Axios from 'axios';
import {useState} from 'react';
import { createToast } from 'helper';




export default function Movieinfo(props){
    const {moviedata, user} = props;
    const [recommended, setRecommended] = useState(
        user && user.recommends.includes(moviedata._id)
    );
    
    const [hiddenDescription, setHiddenDescription] = useState(true);
    const created_at = new Date(moviedata.date);

    let viewCount = moviedata.view.reduce((prev, cur) => prev + cur.count, 0);

    function handleRecommend(e){
        // 추천하기
        if(!recommended){
            Axios.post(`/api/videos/${moviedata.idx}/recommends`)
            .then(res => {
                createToast("추천 완료!", res.data.message, "info");

                setRecommended(true);
            })
            .catch(err => {
                createToast("추천 실패….", err.response.data);
            })
        }
        // 추천취소
        else {
            Axios.delete(`/api/videos/${moviedata.idx}/recommends`)
            .then(res => {
                console.log(res);
                createToast("추천 목록에서 제거되었습니다.", res.data, "info");;
                setRecommended(false);
            })
            .catch(err => {
                console.error(err);
                createToast("추천 취소 실패….", "잠시 후 다시 시도해 주시기 바랍니다.");
            });
        }
    } 

    function handleDownload(e){
        if(moviedata.allowed){
            let a = document.createElement("a");
            a.href = `/api/videos/${moviedata.idx}/download`;
            a.click();
        } else {
            createToast("다운로드 실패!", "이 영상은 제작사가 다운로드를 허락하지 않았습니다!");
        }
    }

    return (
        <div>
            <div className="fx-4 font-weight-bold">{moviedata.title}</div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="fx-n2 text-muted mt-1">
                    <span>조회수 </span>
                    <span>{viewCount.toLocaleString()}</span>
                    <span className="ml-2">출품일 </span>
                    <span>{`${created_at.toLocaleDateString()}`}</span>
                </div>
                <div>
                    <button 
                        className={"fx-n2" + (recommended ? " white-fill-btn" : " fill-btn")}
                        onClick={handleRecommend}
                    >
                        {
                            recommended ? "추천 취소" : "추천"
                        }
                    </button>
                    <button className="fx-n2 fill-btn ml-2" onClick={handleDownload}>다운로드</button>
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