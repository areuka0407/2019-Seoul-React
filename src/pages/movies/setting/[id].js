import Info from '../../../components/movies/setting/Info';
import Detail from '../../../components/movies/setting/Detail';
import Editor from '../../../components/movies/setting/Editor';
import Replies from '../../../components/movies/setting/Replies';
import {createToast} from '../../../../helper';
import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import Axios from 'axios';

function Setting(props){
    const router = useRouter();
    const [page, setPage] = useState('info');
    const [loading, setLoading] = useState(page === 'editor');
    const {user, caption, movie} = props;

    const pageList = {
        'info': <Info movie={movie} />,
        'detail': <Detail movie={movie} />,
        'editor': <Editor movie={movie} caption={caption} onLoadEnd={() => setLoading(false)} />,
        'replies': <Replies movie={movie} />
    }

    useEffect(() => {
        if(!user) {
            createToast("로그인이 필요합니다!", "이 페이지는 로그인을 필요로 합니다! 로그인 후 다시 시도하여 주시기 바랍니다.")
            router.replace("/sign-in");
        }
        else if(user && user._id !== movie.user._id){
            createToast("접근 금지!", "본인의 영상만 수정할 수 있습니다!")
            router.replace("/sign-in");
        }
    }, []);

    

    return  <>
                {
                    loading ?
                    <div className="loading d-flex justify-content-center align-items-center">
                        <i className="fas fa-spinner fa-spin fa-4x text-white"></i>
                    </div>
                    : <></>
                }
                <div className="container full-height padding">
                    <div className="row">
                        <div className="col-sm-12 col-md-3">
                            <div className="fx-3 font-weight-bold pl-3 mb-3">메뉴</div>
                            <div className="menu-list">
                                <div className={"menu-item" + (page == 'info' ? " active" : "")} onClick={() => setPage('info')}>
                                    <span>정보 수정</span>
                                    <div className="arrow">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={"menu-item" + (page == 'detail' ? " active" : "")} onClick={() => setPage('detail')}>
                                    <span>조회수 분석</span>
                                    <div className="arrow">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={"menu-item" + (page == 'editor' ? " active" : "")} onClick={() => {setPage('editor'); setLoading(true);}}>
                                    <span>자막 편집기</span>
                                    <div className="arrow">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={"menu-item" + (page == 'replies' ? " active" : "")} onClick={() => setPage('replies')}>
                                    <span>댓글 관리</span>
                                    <div className="arrow">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-9 mt-5 mt-md-0">
                            {pageList[page]}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .menu-list {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        border-top: 2px solid #222;
                        padding-top: 10px;
                    }

                    .menu-item {
                        position: relative;
                        width: 100%;
                        border-bottom: 1px solid #ddd;
                        height: 40px;
                        line-height: 40px;
                        padding: 0 20px;
                        cursor: pointer;
                        opacity: 0.6;
                    }

                    .menu-item:hover {
                        opacity: 1;
                    }



                    .menu-item.active {
                        opacity: 1;
                    }



                    .menu-item .arrow {
                        position: absolute;
                        right: 10px;
                        top: 15px;
                        width: 10px;
                        height: 10px;
                        transform: rotate(135deg);
                    }

                    .arrow span {
                        position: absolute;
                        background-color: #555;
                        left: 0;
                        top: 0;
                    }

                    .arrow span:first-child {
                        width: 100%;
                        height: 1px;
                    }

                    .arrow span:last-child {
                        height: 100%;
                        width: 1px;
                    }

                    .loading {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 101;
                        background-color: #0008;
                    }
                `}</style>
            </>
}

Setting.getInitialProps = async function(ctx){
    // 영화 정보 불러오기
    let req = await Axios.get("/api/videos?id=" + ctx.query.id);
    let movie = req.data.video;

    // 자막 정보 불러오기
    let caption = {
        list : [],
        length: 0,
    }
    if(movie.caption !== null){
        let req = await Axios.get("/caption/" + movie.caption);
        let data = req.data;

        let regex = /(?<startTime>[0-9]{2}:[0-9]{2}.[0-9]{2}) ~ (?<endTime>[0-9]{2}:[0-9]{2}.[0-9]{2})\r\n(?<text>.+)/;
        while(regex.test(data)){
            let matches = regex.exec(data);
            let idx = data.indexOf(matches[0]);
            data = data.substr(idx + matches[0].length);
            caption.list.push({
                idx: caption.length++, 
                startTime:  matches.groups.startTime.toTime(),
                endTime: matches.groups.endTime.toTime(),
                text: matches.groups.text
            });
        }
    }

    return {movie, caption};
}


export default Setting;