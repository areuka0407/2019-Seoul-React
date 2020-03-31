import Link from 'next/link';
import Videoitem from './Videoitem';

export default function ListItem(props){
    const {info, videoList, active} = props;
    return (
        <div className="box-wrap" onClick={props.onClick}>
            <div className="box">
                <div className="company d-flex px-4 align-items-center">
                    <img src={"/images/profiles/" + info.img} alt=""/>
                    <div className="ml-4 h-100">
                        <div className="z-index fx-2 mb-1 font-weight-bold">{info.name}</div>
                        <div>
                            <div className="z-index fx-n2 text-muted mt-2">
                                <span className="mr-2">팔로워</span> 
                                <span className="font-weight-bold">{info.follower.length.toLocaleString()}</span>
                            </div>
                            <Link href={'/distributor/[id].js'} as={'/distributor/' + info.idx}>  
                                <a className="mt-4 underline-btn fx-n2">바로가기</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="videos">
                    <div className="title fx-1 font-weight-bold px-3">출품 목록</div>
                    {
                        videoList.length > 0 ? 
                        videoList.map((video, idx) => <Videoitem key={idx} info={video} />) 
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
                    /*background-color: #fff;
                    border: 1px solid #ddd;*/
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
                }

                .videos .title {
                    height: 30px;
                    line-height: 30px;
                }
            `}</style>
        </div>
    )
}