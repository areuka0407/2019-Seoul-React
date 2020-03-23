import React from 'react';
import {videos, users} from "../../public/json/data.json";

function MovieItem(props){
    const {info} = props;

    return (
        <div className="movie-item col-lg-4 col-md-6 col-sm-12">
            <div className="w-100 h-100 position-relative">
                <div className="image-box">
                    <img src={"/images/thumbnails/" + info.thumbnail} />
                </div>
                <div className="text-box custom-scrollbar px-4 py-5">
                    <div className="title fx-3 font-weight-bold">{info.title}</div>
                    <div className="user_name fx-n3 mt-2">{info.user.name}</div>
                    <p className="description mt-5">
                        {info.description}
                    </p>
                </div>
            </div>
            <style jsx>{`
                .movie-item { height: 400px; padding: 10px; }
                .movie-item:nth-child(3n-1) { transform: translateY(15%); }
                @media(max-width: 992px) { 
                    .movie-item:nth-child(3n-1) { transform: translateY(0); }
                }

                .image-box {
                    overflow: hidden;
                    border: 1px solid #ddd;
                    width: 100%;
                    height: 100%;
                }

                .image-box > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }

                .image-box > img:hover { transform: scale(1.1); }


                .text-box {
                    user-select: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    background-color: #fffc;
                    opacity: 0;
                    transition: opacity 0.5s;
                }

                .user_name { color: #555; }

                .description {
                    line-height: 1.8em;
                    font-size: 0.85em;
                }

                .movie-item:hover .text-box {
                    opacity: 1;
                }

            `}</style>
        </div>
    );
}

export default class MovieList extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            selected: null,
            showList: [],
            videoList: videos.map(video => {
                video.user = users.find(user => user.idx == video.users_id);
                return video;
            })
        }
    }

    componentDidMount(){
        const {videoList} = this.state;
        const initialLength = 50;
        const showList = [];
        const startNo = parseInt(Math.random() * videoList.length - 1);
        for(let i = 0; i < initialLength; i++){
            showList.push( videoList[(startNo + i) % videoList.length] );
        }
        this.setState({showList});
    }


    render(){
        const {selected, showList} = this.state;
        return (
        <div className="movie-info padding container">
            <div className="section-title text-center">
                <h5 className="fx-4 font-weight-bold">인기영화</h5>
                <p className="mt-4 fx-n1 text-muted">부산국제영화제에서 최고의 영화를 만나보세요!</p>
            </div>
            <div className="row">
                {showList.map((x, i) => <MovieItem key={i} info={x} selected={selected == x.idx} />)}
            </div>
            <style jsx>{`
                .section-title {
                    height: 110px;
                    margin-bottom: 40px;
                    position: relative;
                }

                .section-title::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    width: 1px;
                    height: 60px;
                    background-color: #444;
                }
            `}</style>
        </div>
        );
    }
}


