import {useEffect, useRef, useState} from 'react';
import Form from './Editor/Form';
import Video from './Editor/Video';
import CaptionLine from './Editor/CaptionLine';
import {createToast} from '../../../../helper';


export default function Editor(props){
    const {movie, onLoadEnd} = props;
    const video = useRef(null);
    const voiceCanvas = useRef(null);
    const [imageArr, setImageArr] = useState([]);
    const [captionTarget, setCaptionTarget] = useState(null);
    const [caption, setCaption] = useState((props.caption ? props.caption : []));
    const captureLength = 10;


    const handleClickImage = e => video.current.currentTime = parseFloat(e.target.alt);
    const handlePushCaption = ({startTime, endTime, text}) => {
        const _caption = JSON.parse(JSON.stringify(caption));

        if(text.trim().length == 0){
            createToast("자막 텍스트 오류!", "빈 자막은 삽입할 수 없습니다. 자막을 입력해 주세요.")
        } else if (endTime <= startTime){
            createToast("자막 시간 오류!", "자막의 시작시간은 종료시간보다 빨라야 합니다.")
        } else if(_caption.find(x => x.startTime <= endTime && startTime <= x.endTime)){
            createToast("자막 시간 오류!", "해당 시각에는 이미 자막이 존재하여 더 이상 추가할 수 없습니다.")
        } else {
            let newCaption = { startTime, endTime, text }
            _caption.push(newCaption);
            setCaption(_caption);
        }
    }

    const changeTarget = ({startTime, endTime, text}) => {
        const _target = captionTarget;
        
        if(_target === null){
            setCaptionTarget({startTime, endTime, text});
        } else {
            _target.startTime = startTime;
            _target.endTime = endTime;
            _target.text = text;
            setCaptionTarget(_target);
        }
    }

    useEffect(() => {
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
                        <Video _ref={video} movie={movie} caption={caption} />
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
                        <div className="voice-line w-100">
                            <canvas ref={voiceCanvas} className="w-100" width="750" height="50"></canvas>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <CaptionLine caption={caption} />
                    </div>
                    <div className="col-12 mt-4">
                        <Form 
                            video={video} 
                            target={captionTarget} 
                            onPushCaption={handlePushCaption} 
                            onChangeTarget={changeTarget}
                        />
                    </div>
                </div>
                <style jsx>{`
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
                `}</style>
            </div>
}