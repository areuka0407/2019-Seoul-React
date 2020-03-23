import {useRouter} from 'next/router';
import {videos, users} from '../../public/json/data.json';
import Visual from '../../components/Visual';
import Player from '../../components/movies/Player';
import {useState} from 'react';


function Userinfo(props){
    const {userdata} = props;
    return (
        <div className="col-12 d-flex align-items-center mb-5 px-4">
            <img src={"/images/profiles/" + userdata.img} alt="프로필 이미지"/>
            <div className="w-100 ml-4">
                <div className="fx-2 font-weight-bold">{userdata.name}</div>
                <div className="fx-n2 mt-1 text-muted">팔로워: {userdata.follows.toLocaleString()}</div>
                <button className="underline-btn mt-3 fx-n2">팔로우</button>
            </div>
            <style jsx>{`
                img {
                    overflow: hidden;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    flex: 0 0 100px;
                    width: 100px;
                    height: 100px;
                    padding: 10px;
                    object-fit: contain;
                }
            `}</style>
        </div>
    )
}


function Movieinfo(props){
    const {moviedata} = props;
    const created_at = new Date(moviedata.date);
    const [hiddenDescription, setHiddenDescription] = useState(true);

    return (
        <div className="col-12 mt-5 px-4">
            <div className="fx-4 font-weight-bold">{moviedata.title}</div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="fx-n2 text-muted mt-1">
                    <span>조회수 </span>
                    <span>{moviedata.view.toLocaleString()}</span>
                    <span className="ml-2">출품일 </span>
                    <span>{`${created_at.getFullYear()}-${created_at.getMonth() + 1}-${created_at.getDate()}`}</span>
                </div>
                <div>
                    <button className="fx-n2 fill-btn">추천</button>
                    <button className="fx-n2 fill-btn ml-3">다운로드</button>
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


export default function Movie(){
    const router = useRouter();
    const video = router.query.id ? videos.find(video => video.idx == router.query.id) : videos[0];
    const user = users.find(user => user.idx == video.users_id);
    return (
        <div>
            <Visual mainTitle="Movie Information" subTitle="영화 정보" src="/images/more_img_4.jpg" />
            <div className="container padding">
                <div className="row">
                    <Userinfo userdata={user} />
                    <div className="col-12 px-4">
                        <Player video={video} />
                    </div>
                    <Movieinfo moviedata={video} />      
                </div>
            </div>
        </div>
    )
}