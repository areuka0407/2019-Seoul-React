import {videos} from "../public/json/data.json";

function Visual(){
    return (
        <div className="visual">
            <div className="images">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <style jsx>{`
                .visual {
                    position: relative;
                    height: 700px;
                }

                .visual .images,
                .visual .images div {
                    position: absolute;
                    left: 0; top: 0;
                    width: 100%;
                    height: 100%;
                }

                .visual .images div {
                    background-color: #17213B;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center center;
                    filter: brightness(70%) grayscale(30%);
                    background-blend-mode: lighten;
                }

                .visual .images div:nth-child(1)  { background-image: url(/images/more_img_4.jpg) }
                .visual .images div:nth-child(2)  { background-image: url(/images/more_img_5.jpg); }
                .visual .images div:nth-child(3)  { background-image: url(/images/more_img_6.jpg); }

                @keyframes Slide {
                    
                }
            `}</style>
        </div>
    )
}


export default function Index(){
    let video = videos[ parseInt(Math.random() * videos.length - 1) ];
    return (
        <div>
            <Visual />
            <div className="movie-info padding container">
                <div className="row">
                    <div className="col-md-6 py-4">
                        <img className="w-100" src={"/images/thumbnails/" + video.thumbnail} alt="섬네일 이미지" />
                    </div>
                    <div className="col-md-6 py-4">
                        <div className="fx-n2 text-muted">영화정보</div>
                        <div className="fx-4 font-weight-bold">{video.title}</div>
                        <div className="mt-4">{video.description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}