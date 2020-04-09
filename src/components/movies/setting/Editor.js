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
    const {movie, caption} = props;
    const video = useRef(null);
    const [imageArr, setImageArr] = useState([]);
    const captureLength = 10;

    useEffect(() => {

        // 이미지 추출
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
                                    <img
                                        className="w-100" 
                                        key={video.currentTime} 
                                        src={src} 
                                        alt="캡쳐 이미지" 
                                        data-time={video.currentTime}
                                    />
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


        let loadCaptureImage = async () => {
            let imageArr = [];
            for await (let img of captures){
                imageArr.push(img)
            }
            setImageArr(imageArr);
        }
        loadCaptureImage();
        
        

        // 오디오 추출

        // let actx = new AudioContext();
        // fetch(video.current.src)
        // .then(res => res.arrayBuffer())
        // .then(blob => actx.decodeAudioData(blob))
        // .then(audioData => {
        //     let channel = audioData.getChannelData(0);
        // });

        // let soundWorker = new Worker("/js/workers/sound-capture.js");
        // soundWorker.postMessage({src: video.current.src});


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
                        <div className="capture-line custom-scrollbar">
                            {
                                imageArr
                            }
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="voice-line">

                        </div>
                    </div>
                    <div className="col-12">
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
                        height: 350px;
                        overflow-x: hidden;
                        overflow-y: auto;
                        background-color: #ddd;
                    }

                    .capture-line img {
                        width: 100%;
                    }
                `}</style>
            </div>
}