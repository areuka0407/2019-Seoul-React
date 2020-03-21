export default function Movieinfo(props){
    const video = props.video;
    return (
        <div className="movie-info padding container">
            <div className="row">
                <div className="col-md-6 py-4">
                    <img className="w-100" src={"/images/thumbnails/" + video.thumbnail} alt="섬네일 이미지" />
                </div>
                <div className="col-md-6 py-4">
                    <div className="fx-n2 text-muted">영화정보</div>
                    <div className="fx-4 font-weight-bold">{video.title}</div>
                    <div className="description mt-4">{video.description}</div>
                </div>
            </div>
            <style jsx>{`
                .description {
                    line-height: 1.5em;
                    height: 7.5em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                }
            `}</style>
        </div>
    )
}