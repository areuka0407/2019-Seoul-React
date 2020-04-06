import {useState, useEffect} from 'react';
import '../../../../helper';

function CaptionLine(props){
    const {hidden, caption} = props;
    const _hidden = caption === undefined || hidden;

    return <div className="caption-line">
                <div className="text">{_hidden ? "" : props.caption.text}</div>
                <style jsx>{`
                    .caption-line {
                        ${_hidden ? "display: none;" : ""}
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 10%;
                        padding: 10px;
                        background-color: #000a;
                    }

                    .text {
                        color: #fff;
                        font-size: 1.3em;
                    }
                `}</style>
            </div>
}


function Timeline(props){
    const {currentTime, duration} = props;
    const [clicked, setClicked] = useState(false);


    function handleDragstart(e){
        e.preventDefault();
    }

    function handleMouseDown(e){
        props.onTimeControl(e);
        setClicked(true);
    }

    const handleMousemove = (e) => {
        clicked && props.onTimeControl(e);
    }

    const handleMouseup = (e) => {
        setClicked(false);
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMousemove);
        window.addEventListener("mouseup", handleMouseup);

        return () => {
            window.removeEventListener("mousemove", handleMousemove);
            window.removeEventListener("mouseup", handleMouseup);
        }
    }, [clicked]);

    return (
        <div id="time-line" onDragStart={handleDragstart} onMouseDown={handleMouseDown}>
            <div className="cursor-line"></div>
            <style jsx>{`
                #time-line {
                    width: 100%;
                    height: 5px;
                    background-color: #fff5;
                    cursor: pointer;
                    position: relative;
                }

                #time-line:hover {
                    background-color: #fffa;
                }

                .cursor-line {
                    background-color: #3486BB;
                    position: absolute;
                    left: 0; top: 0;
                    width: ${currentTime * 100 / duration}%; 
                    height: 100%;
                }

                .cursor-line::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translate(50%, -50%) scale(${clicked ? 1 : 0});
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background-color: #3486BB;
                    transition: 0.3s transform;
                }

                #time-line:hover .cursor-line::after {
                    transform: translate(50%, -50%) scale(1);
                }
            `}</style>
        </div>
    )
}

export default function Player(props){
    const {video, caption} = props;
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [paused, setPaused] = useState(true);
    const [showCaption, setShowCaption] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [init, setInit] = useState(true);

    let currentCaption = caption && caption.find(c => c.startTime <= currentTime && currentTime <= c.endTime);


    // handles
    function handleTimecontrol(e){
        const $video = document.querySelector("#player video");
        const $target = document.querySelector("#time-line");

        let parent = $target.offsetParent;
        let left = $target.offsetLeft;
        while(parent){
            left += parent.offsetLeft;
            parent = parent.offsetParent;
        }

        let X = e.pageX - left > $target.offsetWidth ? $target.offsetWidth : e.pageX - left < 0 ? 0 : e.pageX - left;
        
        const currentTime = X * $video.duration / $target.offsetWidth;
        $video.currentTime = currentTime;
        setCurrentTime(X * $video.duration / $target.offsetWidth);
    }
    function handleStop(){
        document.querySelector("#player video").currentTime = 0;
        setCurrentTime(0);
        setPaused(true);
    }
    function handleChangeVolume(e){
        const target = e.nativeEvent.target;
        const v = target.value / 100;
        document.querySelector("#player video").volume = v;
        setMuted(false);
        setVolume(v);
    }
    function handleEnded(e){
        setPaused(true);
        setInit(true);
    }
    function handleTimeUpdate(e){
        const target = e.nativeEvent.target;
        setCurrentTime(target.currentTime);
    }


    /**
     * effect
     */
    // play & pause
    useEffect(() => {
        const $video = document.querySelector("#player video");
        paused ? $video.pause() : $video.play();
    }, [paused]);

    // muted
    useEffect(() => {
        const $video = document.querySelector("#player video");
        $video.muted = muted;
    }, [muted]);

    // full screen
    useEffect(() => {
        const $player = document.querySelector("#player");
        isFullScreen ? 
            $player.requestFullscreen && $player.requestFullscreen() 
            : document.fullscreenElement && document.exitFullscreen();
    }, [isFullScreen]);

    


    return (
        <div id="player">
            <video
                onDoubleClick={() => setPaused(!paused)} 
                src={"/video/" + video.video} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />
            <CaptionLine caption={currentCaption} hidden={!showCaption} />   
            {
                    init ?
                    <button className={"init-play " + (paused ? "d-block" : "d-none")} onClick={() => setInit(false) || setPaused(false)}>
                        <i className="fas fa-play"></i>
                    </button>
                    :<div className="controls text-white">
                        <Timeline currentTime={currentTime} duration={video.duration} onTimeControl={handleTimecontrol} />
                    <div className="d-flex">
                        <button className={paused ? "d-block" : "d-none"} onClick={() => setPaused(false)}>
                            <i className="fas fa-play"></i>
                        </button>
                        <button className={paused ? "d-none" : "d-block"} onClick={() => setPaused(true)}>
                            <i className="fas fa-pause"></i>
                        </button>
                        <button className="text-white" onClick={() => handleStop()}>
                            <i className="fas fa-stop"></i>
                        </button>
                        <span>
                            {currentTime.sectotime()} / {video.duration.sectotime()}
                        </span>
                    </div>
                    <div className="d-flex">
                        <div className="d-flex align-items-center">
                            <button className={volume >= 0.5 && !muted ? "d-block" : "d-none"} onClick={() => setMuted(true)}>
                                <i className="fas fa-volume-up"></i>
                            </button>
                            <button className={volume < 0.5 && !muted ? "d-block" : "d-none"} onClick={() => setMuted(true)}>
                                <i className="fas fa-volume-down"></i>
                            </button>
                            <button className={muted ? "d-block" : "d-none"} onClick={() => setMuted(false)}>
                                <i className="fas fa-volume-mute"></i>
                            </button>
                            <input type="range" className="range" min="0" max="100" value={volume * 100} step="1" onChange={handleChangeVolume} />
                        </div>
                        <button className={isFullScreen ? "active" : ""} onClick={() => setIsFullScreen(!isFullScreen)}>
                            <i className="fas fa-expand"></i>
                        </button>
                        <button className={showCaption ? "active" : ""} onClick={() => setShowCaption(!showCaption)}>
                            <i className="fas fa-closed-captioning"></i>
                        </button>
                    </div>
                </div>
            }
            <style jsx>{`

                #player {
                    width: 100%;
                    height: 600px;
                    position: relative;
                    background-color: #000;
                    overflow: hidden;
                    user-select: none;
                }

                video {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 100%;
                    object-fit: contain;
                }

                #player:hover .controls { opacity: 1; }

                .controls {
                    opacity: 0;
                    transition: opacity 0.3s;
                    width: 100%;
                    height: 50px;
                    position: absolute;
                    left: 0; bottom: 0;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                }

                button {
                    display: inline-block;
                    width: 45px;
                    height: 45px;
                    border: none;
                    background: none;
                    color: #fff;
                    outline: none;
                    opacity: 0.7;
                }
                button:hover { opacity: 1; }
                button.active { color: #3486BB; }

                span {
                    height: 45px;
                    line-height: 45px;
                    padding: 0 10px;
                    color: #ddd;
                }


                .init-play {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: auto;
                    height: auto;
                    font-size: 5em;
                    transform: translate(-50%, -50%);
                }
            `}</style>
        </div>
    )
}