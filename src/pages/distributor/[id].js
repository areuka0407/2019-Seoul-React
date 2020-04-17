import {useState} from 'react';
import Visual from '../../components/Visual';
import Movieinfo from '../../components/distributor/info/Movieinfo';
import Userinfo from '../../components/distributor/info/Userinfo';
import '../../../helper';
import Axios from 'axios';

function DistributorInfo(props) {
    const {userInfo, movieList} = props;
    const [order, setOrder] = useState('view/asc');

    let split = order.split("/");
    let orderKey = split[0];
    let orderArrow = split[1];

    const handleChange = e => setOrder(e.target.value);
    
    return (
        <div>
            <Visual mainTitle="Distributor Information" subTitle="영화 배급사 정보" src="/images/more_img_3.jpg" />
            <div className="container padding">
                <div className="row align-items-start">
                    <div className="col-sm-12 col-md-4">
                        <Userinfo userdata={userInfo} />
                    </div>
                    <div className="col-sm-12 col-md-8">
                        <div className="list-head w-100 d-flex justify-content-between align-items-center">
                            <div className="fx-2">출품 영화목록</div>
                            <select id="order-by" className="form-control fx-n2" style={{"width": "200px"}} value={order} onChange={handleChange}>
                                <option value="view/asc">조회수: 오름차순</option>
                                <option value="view/desc">조회수: 내림차순</option>
                                <option value="date/asc">출품일: 오름차순</option>
                                <option value="date/desc">출품일: 내림차순</option>
                            </select>
                        </div>
                        <hr/>
                        <div className="w-100 d-flex flex-column align-items-center">
                            {
                                movieList
                                .sort((a, b) => {
                                    if(orderKey === "view"){
                                        let aView = a.view.reduce((p, c) => p + c.count, 0);
                                        let bView = b.view.reduce((p, c) => p + c.count, 0);
                                        return (aView - bView) * (orderArrow === "asc" ? 1 : -1);
                                    }
                                    else if(orderKey === "date"){
                                        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * (orderArrow === "asc" ? 1 : -1);
                                    }
                                })
                                .map((movie, idx) => <Movieinfo key={idx} moviedata={movie} />)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

DistributorInfo.getInitialProps = async function(ctx){
    const userReq = await Axios.get("/api/users?idx=" + ctx.query.id);
    const videoReq = await Axios.get("/api/videos?user=" + ctx.query.id);

    return {
        userInfo: userReq.data.user,
        movieList: videoReq.data.videoList,
    }
}


export default DistributorInfo;