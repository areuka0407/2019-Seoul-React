import {useState, useEffect} from 'react';


function Timeline(props){
    const {currentTime, duration} = props;

    useEffect(() => {
        let clicked = false;
        document.querySelector("#time-line").addEventListener("dragstart", e => e.preventDefault());
        document.querySelector("#time-line").addEventListener("mousedown", e => (clicked = true) && props.onTimeControl(e));
        window.addEventListener("mousemove", e => clicked && props.onTimeControl(e));
        window.addEventListener("mouseup", e => clicked = false);
    }, []);

    return (
        <div id="time-line">
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
                    right: -4px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #3486BB;
                }
            `}</style>
        </div>
    )
}

export default function Player(props){
    const {video} = props;
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [paused, setPaused] = useState(true);
    const [showCaption, setShowCaption] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);


    // handles
    function handleTimecontrol(e){
        if(e.which !== 1) return;
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


    // effect
    useEffect(() => {
        const $video = document.querySelector("#player video");
        paused ? $video.pause() : $video.play();
    }, [paused]);

    useEffect(() => {
        const $player = document.querySelector("#player");
        console.log($player.exitFullscreen);
        isFullScreen ? 
            $player.requestFullscreen && $player.requestFullscreen() 
            : document.fullscreenElement && document.exitFullscreen();
    }, [isFullScreen]);


    return (
        <div id="player">
            <video onDoubleClick={() => setPaused(!paused)} src={"/video/" + video.video} onTimeUpdate={e => setCurrentTime(e.target.currentTime)}></video>
            <div className="controls text-white">
                <Timeline currentTime={currentTime} duration={video.duration} onTimeControl={handleTimecontrol} />
                <div className="d-flex">
                    <button className={paused ? "d-block" : "d-none"} onClick={() => setPaused(false)}>
                        <i className="fas fa-play"/>
                    </button>
                    <button className={paused ? "d-none" : "d-block"} onClick={() => setPaused(true)}>
                        <i className="fas fa-pause"/>
                    </button>
                    <button className="text-white" onClick={() => handleStop()}>
                        <i className="fas fa-stop"></i>
                    </button>
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
                        <input type="range" className="range" min="0" max="1" value={0.5} step="0.01" />
                    </div>
                    <button onClick={() => setIsFullScreen(!isFullScreen)}>
                        <i className="fas fa-expand"></i>
                    </button>
                    <button className={showCaption ? " active" : ""} onClick={() => setShowCaption(!showCaption)}>
                        <i className="fas fa-closed-captioning"></i>
                    </button>
                </div>
            </div>
            <style jsx>{`

                #player {
                    width: 100%;
                    height: 600px;
                    position: relative;
                    background-color: #000;
                    overflow: hidden;
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
                button:hover,
                button.active { opacity: 1; }
            `}</style>
        </div>
    )
}