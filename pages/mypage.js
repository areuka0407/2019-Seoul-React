import React, {useState} from 'react';
import Link from 'next/link';
import Visual from '../components/Visual';
import {videos, users} from '../public/json/data.json';
import '../helper';

function Userinfo(props){
    const {userdata} = props;

    return (
        <div className="d-flex align-items-center">
            <img src={"/images/profiles/" + userdata.img} alt="프로필 이미지"/>
            <div className="w-100 ml-4">
                <div className="fx-2 font-weight-bold">{userdata.name}</div>
                <div className="fx-n2 mt-1 text-muted">팔로워: {userdata.follows.toLocaleString()}</div>
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

function VideoItem(props){
    const {info} = props;
    const created_at = new Date(info.date);

    return (
        <Link href={"/movies/[id].js"} as={"/movies/" + info.idx}>
            <div className="video-item d-flex align-items-center">
                <img src={"/images/thumbnails/" + info.thumbnail} alt="섬네일 이미지" width="200" height="130" />
                <div className="info h-100 pl-4 pr-2 py-3">
                    <div className="fx-n1 font-weight-bold">{info.title}</div>
                    <div className="fx-n4 mt-1 text-muted">
                        <span>출품일</span>
                        <span className="ml-1">{created_at.toLocaleDateString()}</span>
                        <span className="ml-2">상영 시간</span>
                        <span className="ml-1">{info.duration}분</span>
                        <span className="ml-2">조회수</span>
                        <span className="ml-1">{info.view.toLocaleString()}</span>
                    </div>
                    <div className="description fx-n4 mt-3">{info.description}</div>
                </div>
                <style jsx>{`
                    .video-item {
                        position: relative;
                        height: 140px;
                        padding: 0 20px;
                        cursor: pointer;
                    }

                    .video-item:hover {
                        opacity: 0.8;
                    }

                    img {
                        flex: 0 0 200px;
                        width: 200px;
                        height: 130px;
                        object-fit: contain;
                    }

                    .description {
                        line-height: 1.5em;
                        height: 3em;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                `}</style>
            </div>
        </Link>
    )
}



export default function Mypage() {
    const [user, setUser] = useState(users[0]);
    const videoList = videos.filter(video => video.users_id == user.idx);

    return (
        <div>
            <Visual mainTitle="Movies Management" subTitle="내 동영상 관리" src="/images/more_img_4.jpg" />
            <div className="container padding">
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        <Userinfo userdata={user} />
                    </div>
                    <div className="col-sm-12 col-md-8 mt-5 mt-md-0">
                        <div className="title fx-2 px-3 mb-3">출품 목록</div>
                        <hr className="mx-3" />
                        {
                            videoList.length > 0 ? 
                            videoList.map((video, idx) => <VideoItem key={idx} info={video} />) 
                            : <div className="mt-2 px-3 fx-n2 text-muted">출품한 영화가 없습니다.</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}