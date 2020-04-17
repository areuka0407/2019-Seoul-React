import {useEffect, useRef, useState} from 'react';
import Form from './Editor/Form';
import Video from './Editor/Video';
import CaptionLine from './Editor/CaptionLine';
import {createToast} from '../../../../helper';
import Axios from 'axios';


export default function Editor(props){
    const {movie, onLoadEnd} = props;
    const video = useRef(null);
    const voiceCanvas = useRef(null);
    const [imageArr, setImageArr] = useState([]);
    const [target, setTarget] = useState(null);
    const [caption, setCaption] = useState(props.caption);
    const [currentTime, setCurrentTime] = useState(0);
    const [text, setText] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const captureLength = 10;

    // handle

    const handleChangeText = e => setText(e.target.value);

    const handleChangeStartTime = value => {
        let time = parseFloat(value);
        setStartTime(time);
        handleChangeTime(time);
    };

    const handleChangeEndTime = value => setEndTime(parseFloat(value));

    const handlePushCaption = () => {
        const _caption = JSON.parse(JSON.stringify(caption));

        if(text.trim().length == 0){
            createToast("자막 텍스트 오류!", "빈 자막은 삽입할 수 없습니다. 자막을 입력해 주세요.")
        } else if (endTime <= startTime){
            createToast("자막 시간 오류!", "자막의 시작시간은 종료시간보다 빨라야 합니다.")
        } else if(target === null && _caption.list.find(x => x.startTime <= endTime && startTime <= x.endTime)){
            createToast("자막 시간 오류!", "해당 시각에는 이미 자막이 존재하여 더 이상 추가할 수 없습니다.")
        } else {
            if(target){
                let item = _caption.list.find(x => x.idx === target);
                item.startTime = startTime;
                item.endTime = endTime;
                item.text = text;
            } else {
                let newCaption = { idx: _caption.length++, startTime, endTime, text }
                _caption.list.push(newCaption);
            }
            setCaption(_caption);
            setTarget(null);
            setStartTime(0);
            setEndTime(0);
            setText('');
        }
    }

    const handlePopCaption = () => {
        if(!confirm("정말로 이 자막을 삭제하시겠습니까?")) return;
        let _caption = JSON.parse(JSON.stringify(caption));
        let targetIdx = _caption.list.findIndex(x => x.idx === target);
        if(targetIdx >= 0){
            _caption.list.splice(targetIdx, 1);
        }
        setTarget(null);
        setCaption(_caption);
    }

    const handleChangeTime = (value, domUpdate = true) => {
        let time = parseFloat(value)
        setCurrentTime(time); 
        if(domUpdate){
            video.current.currentTime = time;
        }
    }

    const handleSubmit = e => {
        if(!confirm("정말로 자막을 수정하시겠습니까?")) return;

        Axios.put(`/api/videos/${movie.idx}/caption`, {caption})
        .then(res => {
            if(res.status === 200){
                createToast("자막 수정 완료!", "지금부터 수정된 자막으로 영상이 보여집니다!", "success");
                
                window.open("/movies/" + movie.idx, "_blank")
            } else  {
                createToast("자막 수정 오류!", "문제가 발생하였습니다. 잠시 후 다시 시도해 주시기 바랍니다.");
            }
        });
    }

    // effect
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
                                            onClick: () => handleChangeTime(video.currentTime),
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

    useEffect(() => {
        let targetItem = caption.list.find(x => x.idx === target);
        if(targetItem){
            const {startTime, endTime, text} = targetItem;
            setStartTime(startTime);
            setEndTime(endTime);
            setText(text);
        } else {
            setStartTime(0);
            setEndTime(0);
            setText('');
        }
    }, [target]);

    return  <div>
                <div className="mb-4">
                    <p className="fx-3 font-weight-bold mb-2">자막 편집기</p>
                    <p className="fx-n1 text-muted">해당 영상의 자막을 직접 수정해 보세요!</p>
                </div>       
                <div className="row video-line">
                    <div className="col-sm-12 col-md-9">
                        <Video 
                            _ref={video} 
                            movie={movie} 
                            caption={caption}
                            currentTime={currentTime}
                            onChangeTime={handleChangeTime} 
                        />
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
                        <CaptionLine target={target} caption={caption} movie={movie} onChangeTime={handleChangeTime} onChangeTarget={value => setTarget(value)} />
                    </div>
                    <div className="col-12 mt-4">
                        <Form 
                            video={video} 
                            text={text}
                            startTime={startTime}
                            endTime={endTime}
                            onPushCaption={handlePushCaption} 
                            onPopCaption={handlePopCaption}
                            onChangeStartTime={handleChangeStartTime}
                            onChangeEndTime={handleChangeEndTime}
                            onChangeText={handleChangeText}
                            onSubmit={handleSubmit}
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