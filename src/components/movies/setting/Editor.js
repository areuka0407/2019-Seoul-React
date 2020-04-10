import {useEffect, useRef, useState} from 'react';

function captureImage({soruce, timestamp}){
    return new Promise((res, rej) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let copy = document.createElement("video");
        document.body.append(copy);
        copy.addEventListener("loadedmetadata", () =>{
            copy.currentTime = timestamp ? timestamp : 0;
        });
        copy.addEventListener("seeked", () => {
            ctx.drawImage(video, 0, 0);
            let url = canvas.toDataURL("image/jpeg");
            let image = <img src={url} key={timestamp ? timestamp : new Date().getTime()} />
            res(image);
        });
        copy.src = soruce;
    });
}


export default function Editor(props){
    const {movie, caption, onLoadStart, onLoadEnd} = props;
    const video = useRef(null);
    const voiceCanvas = useRef(null);
    const [imageArr, setImageArr] = useState([]);
    const captureLength = 10;


    const handleClickImage = e => video.current.currentTime = parseFloat(e.target.alt);

    useEffect(() => {
        onLoadStart();

        // 이미지 추출
        let loadCaptureImage = async () => {
            const captures = {
                from: 1,
                to: captureLength,
    
                [Symbol.asyncIterator](){
                    return {
                        current: this.from,
                        last: this.to,
    
                        async next(){
                            if(this.current <= this.last){
                                
                                let video = await new Promise(res => {
                                    let _video = document.createElement("video");
                                    _video.src = "/video/" + movie.video;
        
                                    _video.onloadedmetadata = () =>{
                                        _video.currentTime = _video.duration * this.current++ / this.last;
                                    }
                                    _video.onseeked = () => res(_video);
                                });
    
                                let image = await new Promise(res => {
                                    let canvas = document.createElement('canvas');
                                    canvas.width = 600
                                    canvas.height = 350
    
                                    let ctx = canvas.getContext('2d');
                                    ctx.drawImage(video, 0, 0, 600, 350);
    
                                    let src = canvas.toDataURL("image/jpeg");
                                    res(
                                        {
                                            className: "pointer" ,
                                            key: video.currentTime ,
                                            src,
                                            alt: video.currentTime,
                                            onClick: handleClickImage,
                                        }
                                    );
                                });
    
                                return {done: false, value: image}
                            }
                            else {
                                return {done: true}
                            }
                        }
                    }
                }
            }
            let imageArr = [];
            for await (let img of captures){
                imageArr.push(img)
            }
            setImageArr(imageArr);
        }
    
        // 오디오 추출
        let loadVoiceData = () => new Promise(res => {
            let actx = new AudioContext();

            fetch("/video/" + movie.video)
            .then(res => res.arrayBuffer())
            .then(buffer => actx.decodeAudioData(buffer))
            .then(decodedData => {
                let audioBuffer = decodedData.getChannelData(0);
                let soundWorker = new Worker("/js/workers/sound-capture.js");
                
                let offscreen = voiceCanvas.current.transferControlToOffscreen();

                soundWorker.postMessage({buffer: audioBuffer, canvas: offscreen}, [offscreen]);
                soundWorker.onmessage = (e) => {
                    let {resolve} = e.data;
                    if(resolve){
                        res();
                    }
                }
            });
        });


        Promise.all([loadCaptureImage(), loadVoiceData()])
        .then(() => {
            console.log("완료");
            onLoadEnd();
        });

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
                    <div className="col-sm-12 col-md-3 h-md-100">
                        <div className="capture-line custom-scrollbar">
                            <div className="d-flex flex-md-column hx-sm-100">
                                {
                                    imageArr.map(imgProps => <img {...imgProps} />)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="voice-line">
                            <canvas ref={voiceCanvas} width="750" height="100"></canvas>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="input-line">
                            
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .video {
                        position: relative;
                        width: 100%;
                        height: 350px;
                        overflow: hidden;
                    }

                    video {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: #000;
                    }


                    .capture-line {
                        width: 100%;
                        max-height: 350px;
                        overflow: auto;
                        background-color: #ddd;
                    }

                    .capture-line img {
                        flex: 0 0 100px;
                        max-height: 100px;
                    }

                    .voice-line {
                        position: relative;
                        width: 100%;
                        height: 100px;
                        background-color: #ddd;
                    }

                    .voice-line canvas {
                        position: absolute;
                        width: 100%;
                        height: 100px;
                    }
                `}</style>
            </div>
}