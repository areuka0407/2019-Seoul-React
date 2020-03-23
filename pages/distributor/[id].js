import {useRouter} from 'next/router';
import Visual from '../../components/Visual';
import {users, videos} from '../../public/json/data.json';

function Movieinfo(props){
    const router = useRouter();
    const {moviedata} = props;
    const created_at = new Date(moviedata.date);

    return (
        <div className="w-100 py-3 d-flex justify-content-between align-items-end">
            <div className="d-flex">
                <img src={"/images/thumbnails/" + moviedata.thumbnail} alt="섬네일 이미지"/>
                <div className="px-4">
                    <div className="fx-2">{moviedata.title}</div>
                    <div className="fx-n2 text-muted mt-2">
                        <div className="mt-1">
                            <span>출품일</span>
                            <span className="ml-2">{`${created_at.getFullYear()}-${created_at.getMonth() + 1}-${created_at.getDate()}`}</span>
                        </div>
                        <div className="mt-1">
                            <span>조회수</span>
                            <span className="ml-2">{moviedata.view.toLocaleString()}</span>
                        </div>
                        <div className="mt-1">
                            <span>영상 길이</span>
                            <span className="ml-2">{moviedata.duration}분</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="underline-btn" onClick={() => router.replace('/movies/[id].js', '/movies/' + moviedata.idx)}>상세보기</button>
            <style jsx>{`
                img {
                    width: 200px;
                }
            `}</style>
        </div>
    )
}

function Userinfo(props){
    const {userdata} = props;

    return (
        <div className="d-flex align-items-center">
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


export default function DistributorInfo() {
    const router = useRouter();
    const user = router.query.id ? users.find(user => user.idx == router.query.id) : users[0];
    const movieList = videos.filter(video => video.users_id == user.idx);
    
    return (
        <div>
            <Visual mainTitle="Distributor Information" subTitle="영화 배급사 정보" src="/images/more_img_3.jpg" />
            <div className="container padding">
                <div className="row align-items-start">
                    <div className="col-sm-12 col-md-4">
                        <Userinfo userdata={user} />
                    </div>
                    <div className="col-sm-12 col-md-8">
                        <div className="list-head w-100 d-flex justify-content-between align-items-center">
                            <div className="fx-2">출품 영화목록</div>
                            <select id="order-by" className="form-control fx-n2" style={{"width": "200px"}}>
                                <option value="view/asc">조회수: 오름차순</option>
                                <option value="view/desc">조회수: 내림차순</option>
                                <option value="date/asc">출품일: 오름차순</option>
                                <option value="date/desc">출품일: 내림차순</option>
                            </select>
                        </div>
                        <hr/>
                        <div className="w-100 d-flex flex-column align-items-center">
                            {movieList.map((movie, idx) => <Movieinfo key={idx} moviedata={movie} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
