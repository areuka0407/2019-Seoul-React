import React from 'react';
import Visual from '../components/Visual';
import Listitem from '../components/distributor/Listitem';
import Axios from 'axios';


export default class Distributor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            order: "follower/desc",
            activeIdx: null
        }
    }

    static async getInitialProps(ctx){
        let userReq = await Axios.get("/api/users");
        let videoReq = await Axios.get("/api/videos");
        
        return {
            userList: userReq.data.userList, 
            videoList: videoReq.data.videoList
        };
    }

    componentDidMount(){
        this.setState({activeIdx: this.props.userList[0].idx})
    }

    changeHandle = (e) => {
        this.setState({order: e.target.value});
    }

    render(){
        const {userList, videoList} = this.props;
        const {order, activeIdx} = this.state;

        let orderSplit = order.split("/");
        let orderKey = orderSplit[0];
        let orderArrow = orderSplit[1];

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
                                    <select id="order-by" value={order} onChange={this.changeHandle} className="form-control fx-n2" style={{"width": "200px"}}>
                                        <option value="follower/asc">팔로워 수: 오름차순</option>
                                        <option value="follower/desc">팔로워 수: 내림차순</option>
                                        <option value="popular/asc">인기도: 오름차순</option>
                                        <option value="popular/desc">인기도: 내림차순</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            {   
                                userList
                                .sort((a, b) => {
                                    if(orderKey === "follower"){
                                        return orderArrow === "asc" ? a.follower.length - b.follower.length : b.follower.length - a.follower.length;
                                    } else if(orderKey === 'popular'){
                                        // 조회수의 합 비교
                                        let a_totalView = a.videos.reduce((p, c) => p + c.view.reduce((p, c) => p + c.count, 0), 0);
                                        let b_totalView = b.videos.reduce((p, c) => p + c.view.reduce((p, c) => p + c.count, 0), 0);

                                        let a_result = a_totalView / a.videos.length * a.follower.length;
                                        let b_result = b_totalView / b.videos.length * b.follower.length;

                                        let result = a_result - b_result;
                                        if(result === 0) result = a.created_at - b.created_at;

                                        return result * ( orderArrow === 'asc' ? 1 : -1 );
                                    }
                                })
                                .map((user, i) => <Listitem 
                                                        key={i} 
                                                        info={user} 
                                                        active={user.idx == activeIdx} 
                                                        videoList={videoList.filter(video => video.user.idx === user.idx).slice(0, 3)}
                                                        onClick={() => this.setState({activeIdx: user.idx})} 
                                                    />
                                                )   
                            }
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