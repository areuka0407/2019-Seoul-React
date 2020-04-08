import Link from 'next/link';

function VideoItem(props){
    const {info} = props;
    const created_at = new Date(info.date);

    let viewCount = info.view.reduce((prev, cur) => prev + cur.count, 0);

    return (
        <Link href={"/movies/setting/[id].js"} as={"/movies/setting/" + info.idx}>
            <div className="video-item d-flex align-items-center">
                <img src={"/images/thumbnails/" + info.thumbnail} alt="섬네일 이미지" width="200" height="130" />
                <div className="info h-100 pl-4 pr-2 py-3">
                    <div className="fx-n1 font-weight-bold">{info.title}</div>
                    <div className="fx-n4 mt-1 text-muted d-flex flex-wrap">
                        <span>출품일</span>
                        <span className="ml-1">{created_at.toLocaleDateString()}</span>
                        <span className="ml-2">상영 시간</span>
                        <span className="ml-1">{info.duration}분</span>
                        <span className="ml-2">조회수</span>
                        <span className="ml-1">{viewCount.toLocaleString()}</span>
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

export default function Videolist(props){
    const {list} = props;

    return (
        <>
            <div className="title fx-2 px-3 mb-3">출품 목록 관리</div>
            <hr className="mx-3" />
            {
                list.length > 0 ? 
                list.map((video, idx) => <VideoItem key={idx} info={video} />) 
                : <div className="mt-2 px-3 fx-n2 text-muted">출품한 영화가 없습니다.</div>
            }
        </>
    )
}