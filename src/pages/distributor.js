import React from 'react';
import Visual from '../components/Visual';
import {videos, users} from '../../public/json/data.json';
import Listitem from '../components/distributor/Listitem';


export default class Distributor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showList: [],
            activeIdx: null
        }
    }

    componentDidMount(){
        const showList = [1, 3, 16]; // 보여져야할 유저 목록
        
        this.setState({
            showList: showList.map(idx => {
                let user = users.find(user => user.idx == idx);
                user.videoList = videos.filter(video => video.users_id == idx).sort((a, b) => a.view - b.view).slice(0, 3);
                return user;
            }),
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
                        <div className="col-md-6 col-sm-12">
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
                        <div className="col-md-6 col-sm-12">
                            {showList.map((x, i) => <Listitem key={i} info={x} active={activeIdx == x.idx} onClick={() => this.setState({activeIdx: x.idx})} />)}
                        </div>
                    </div>
                    <style jsx>{`
                        .section-title {
                            /*background-color: #fff;    
                            border: 1px solid #ddd;*/
                        }   
                    `}</style>
                </div>
            </div>
        )
    }
}