import {useState, useEffect} from 'react';
import '../../../../../helper';

export default function Video(props){
    const {movie, _ref, caption, currentTime, onChangeTime} = props;
    const [paused, setPaused] = useState(true);

    const currentCaption = caption.list.find(c => c.startTime <= currentTime && currentTime <= c.endTime);

    useEffect(() => {
        paused ? _ref.current.pause() : _ref.current.play();
    }, [paused]);

    return <div className="video">
                <video 
                    ref={_ref} 
                    src={"/video/" + movie.video} 
                    onTimeUpdate={e => onChangeTime(e.target.currentTime, false)}
                />
                {
                    currentCaption &&
                    <div className="caption">
                        {currentCaption.text}
                    </div>
                }
                <div className="controls">
                    <button className="mr-2" onClick={() => setPaused(!paused)}>
                        <span className={paused ? " d-inline" : " d-none"}>
                            <i className="fas fa-play"></i>
                        </span>
                        <span className={!paused ? " d-inline" : " d-none"}>
                            <i className="fas fa-pause"></i>
                        </span>
                    </button>
                    <div className="fx-n1">
                        <span>{currentTime.sectotime()}</span>
                        <span className="mx-2">/</span>
                        <span>{movie.duration.sectotime()}</span>
                    </div>
                    <input 
                        type="range" 
                        className="range mx-3 w-100" 
                        value={currentTime} 
                        min="0"
                        max={movie.duration}
                        onChange={e => onChangeTime(e.target.value)} 
                    />
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
                        pointer-events: none;
                    }

                    .controls {
                        position: absolute;
                        width: 100%;
                        height: 40px;
                        left: 0;
                        bottom: 0;
                        color: #fff;
                        padding: 5px;
                        background-color: #000a;
                        display: flex;
                        align-items: center;
                    }

                    button {
                        background: none;
                        background-color: transparent;
                        border: none;
                        color: #fff;
                        width: 40px;
                        height: 40px;
                        outline: none;
                    }

                    .caption {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        padding: 10px;
                        background-color: #000a;
                        color: #fff;
                        font-size: 1.3em;
                    }
                `}</style>
            </div>
}