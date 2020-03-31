import {useState} from 'react';
import Link from 'next/link';

export default function VideoItem(props){
    const {info} = props;
    const [hover, setHover] = useState(false);

    let viewCount = info.view.reduce((prev, cur) => prev + cur.count, 0);

    const handleMounseOver = (e) => {
        let nodeName = e.nativeEvent.fromElement.nodeName.toLowerCase();
        if(nodeName !== "video" && nodeName !== "img") setHover(true)
    };
    const handleMouseReave = (e) => setHover(false);
    const handleTimeUpdate = (e) => {
        let event = e.nativeEvent;
        if(event.target.currentTime > 5)  setHover(false);
    }

    return (    
        <Link href="/movies/[id].js" as={"/movies/" + info.idx}>
            <div className="video-item d-flex align-items-center">
                {
                    hover == false ?
                    <img 
                        onMouseOverCapture={handleMounseOver} 
                        onMouseLeave={handleMouseReave}
                        src={"/images/thumbnails/" + info.thumbnail} 
                        alt="섬네일 이미지" 
                        width="200" 
                        height="130" 
                    />
                    : <video 
                        onMouseOverCapture={handleMounseOver} 
                        onMouseLeave={handleMouseReave}
                        onTimeUpdate={handleTimeUpdate}
                        src={"/video/" + info.video}
                        autoPlay="autoPlay"
                        muted
                      />
                }
                <div className="info h-100 pl-4 pr-2 py-3">
                    <div className="fx-n1 font-weight-bold">{info.title}</div>
                    <div className="fx-n4 mt-1 text-muted">
                        <span>상영 시간</span>
                        <span className="ml-1">{info.duration}분</span>
                        <span className="ml-2">조회수</span>
                        <span className="ml-1">{viewCount.toLocaleString()}</span>
                    </div>
                    <div className="description fx-n4 mt-3">{info.description}</div>
                </div>
                <style jsx>{`
                    .video-item {
                        height: 140px;
                        padding: 0 20px;
                    }

                    .video-item:hover {
                        cursor: pointer;
                        opacity: 0.8;
                    }

                    img, video {
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