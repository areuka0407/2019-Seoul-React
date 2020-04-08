import {useEffect, useRef} from 'react';


export default function Editor(props){
    const video = useRef(null);
    const {movie, caption} = props;

    useEffect(() => {
        const _video = video.current;

        let actx = new AudioContext();
        fetch(_video.src)
        .then(res => res.arrayBuffer())
        .then(blob => actx.decodeAudioData(blob))
        .then(audioData => {
            console.log(audioData);
        });

        let soundWorker = new Worker("/js/workers/sound-capture.js");
        soundWorker.postMessage({src: _video.src})
    }, []);

    return  <div>
                <div className="mb-4">
                    <p className="fx-3 font-weight-bold mb-2">자막 편집기</p>
                    <p className="fx-n1 text-muted">해당 영상의 자막을 직접 수정해 보세요!</p>
                </div>       
                <div className="row video-line">
                    <div className="col-sm-12 col-md-9">
                        <div className="video">
                            <video ref={video} src={"/video/" + movie.video} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 h-100">

                    </div>
                </div>
                <style jsx>{`
                    .video {
                        position: relative;
                        width: 100%:
                        height: 450px;
                    }

                    .video video {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }

                `}</style>
            </div>
}