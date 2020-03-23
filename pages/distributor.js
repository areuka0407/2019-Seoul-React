import React from 'react';
import Visual from '../components/Visual';
import Link from 'next/link';
import {videos, users} from '../public/json/data.json';


function VideoItem(props){
    const {info} = props;
    return (
        <div className="video-item d-flex align-items-center">
            <img src={"/images/thumbnails/" + info.thumbnail} alt="섬네일 이미지"/>
            <div className="info h-100 pl-4 pr-2 py-3">
                <div className="fx-n1 font-weight-bold">{info.title}</div>
                <div className="fx-n4 mt-1 text-muted">
                    <span>상영 시간</span>
                    <span className="ml-1">{info.duration}분</span>
                    <span className="ml-2">조회수</span>
                    <span className="ml-1">{info.view.toLocaleString()}</span>
                </div>
                <div className="description fx-n4 mt-3">{info.description}</div>
            </div>
            <style jsx>{`
                .video-item {
                    height: 140px;
                    padding: 0 20px;
                }

                img {
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
    )
}

function ListItem(props){
    const {info, active} = props;
    const videoList = videos.filter(video => video.users_id == info.idx).sort((a, b) => a.view - b.view).slice(0, 3);

    return (
        <div className="box-wrap col-md-6 col-sm-12" onClick={props.onClick}>
            <div className="box">
                <div className="company d-flex px-4 align-items-center">
                    <img src={"/images/profiles/" + info.img} alt=""/>
                    <div className="ml-4 h-100">
                        <div className="z-index fx-2 mb-1 font-weight-bold">{info.name}</div>
                        <div>
                            <div className="z-index fx-n2 text-muted">
                                <span className="mr-2">팔로워</span> 
                                {info.follows.toLocaleString()} 명
                            </div>
                            <Link href={'/distributor/info?id=' + info.idx} as={'/distributor/' + info.idx}>  
                                <a className="mt-4 custom-btn fx-n2">바로가기</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="videos">
                    <div className="title fx-1 font-weight-bold px-3">출품 목록</div>
                    {
                        videoList.length > 0 ? 
                        videoList.map((video, idx) => <VideoItem key={idx} info={video} />) 
                        : <div className="mt-2 px-3 fx-n2 text-muted">출품한 영화가 없습니다.</div>
                    }
                </div>
            </div>
            <style jsx>{`
                .box-wrap {
                    padding: 5px;
                    transition: height 0.5s, opacity 0.3s;
                    height: ${
                        active ? 
                            videoList.length === 0 ?
                                 "300px" 
                                 : 230 + 140 * videoList.length + "px" 
                            : "180px"
                    };
                }

                .box {
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    overflow: hidden;
                    position: relative;
                }

                img {
                    width: 150px;
                    height: 150px;
                    right: 20px;
                    top: 0;
                    object-fit: contain;
                    padding: 10px;
                    opacity: ${active ? 1 : 0.5};
                    transition: opacity 0.3s;
                }

                .box:hover img { opacity: 1; transition: opacity 0.5s; }

                .videos {
                    margin-top: 30px;
                    user-select: none;
                    background-color: #fff;
                }

                .videos .title {
                    height: 30px;
                    line-height: 30px;
                }
            `}</style>
        </div>
    )
}

export default class Distributor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showList: [],
            activeIdx: null
        }
    }

    componentDidMount(){
        const showList = [1, 3, 16];
        
        this.setState({
            showList: showList.map(idx => users.find(user => user.idx == idx)),
            activeIdx: showList[0],
        });
    }

    render(){
        const {showList, activeIdx} = this.state;
        return (
            <div>
                <Visual mainTitle="Distributor List" subTitle="영화제 참여 기업 목록" src="/images/more_img_1.jpg" />
                <div className="container padding">
                    <div className="row align-items-start">
                        <div className="w-100" style={{padding: "5px"}}>
                            <div className="section-title px-5 py-4">
                                <div>
                                    <div className="fx-3 mb-3 font-weight-bold">영화 배급사 목록</div>
                                    <div className="fx-n1 text-muted">부산국제영화제에 참여한 기업들을 검색할 수 있습니다.</div>
                                </div>
                                <hr className="my-4" />
                                <div>
                                    <select id="order-by" className="form-control fx-n2" style={{"width": "200px"}}>
                                        <option value="follows/asc">팔로워 수: 오름차순</option>
                                        <option value="follows/desc">팔로워 수: 내림차순</option>
                                        <option value="popular/asc">인기도: 오름차순</option>
                                        <option value="popular/desc">인기도: 내림차순</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {showList.map((x, i) => <ListItem key={i} info={x} active={activeIdx == x.idx} onClick={() => this.setState({activeIdx: x.idx})} />)}
                    </div>
                    <style jsx>{`
                        .section-title {
                            background-color: #fff;    
                            border: 1px solid #ddd;
                        }   
                    `}</style>
                </div>
            </div>
        )
    }
}