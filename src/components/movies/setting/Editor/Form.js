export default function Form(props){
    const {
        video, 
        text,
        startTime,
        endTime,
        onPushCaption, 
        onPopCaption,
        onChangeStartTime, 
        onChangeEndTime, 
        onChangeText} = props;

    return  <>
                <div className="input-line d-flex flex-wrap align-items-start">
                    <div className="col-sm-12 col-md-6 form-group">
                        <label>자막</label>
                        <input 
                            type="text" 
                            value={text} 
                            onChange={onChangeText} 
                        />
                    </div>
                    <div className="col-sm-12 col-md-3 form-group">
                        <label>시작 시간</label>
                        <div className="d-flex">
                            <input 
                                type="number" 
                                value={startTime} 
                                min="0" 
                                onChange={e => onChangeStartTime(e.target.value)} 
                                step="0.5" 
                            />
                            <button 
                                className="fill-btn clock" 
                                onClick={() => onChangeStartTime( video.current.currentTime.toFixed(2) )}
                            >
                                <i className="far fa-clock"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 form-group">
                        <label>종료 시간</label>
                        <div className="d-flex">
                            <input 
                                type="number" 
                                value={endTime} 
                                min="0" 
                                onChange={e => onChangeEndTime(e.target.value)} 
                            />
                            <button 
                                className="fill-btn clock" 
                                onClick={() => onChangeEndTime( video.current.currentTime.toFixed(2) )}
                            >
                                <i className="far fa-clock"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4">
                        <div className="d-flex justify-content-between">
                            <div>
                                <button className="underline-btn mr-3" onClick={onPushCaption}>
                                    적용하기
                                </button>
                                <button className="underline-btn mr-3" onClick={onPopCaption}>
                                    삭제하기
                                </button>
                            </div>
                            <div>
                                <button className="fill-btn">
                                    저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    input:not([type='files']):not(.range), textarea {
                        display: block;
                        border: 1px solid #ddd;
                        padding: 0.7em 0.8em;
                        font-size: 0.85em;
                        outline: none;
                        background-color: #fff;
                        width: calc(100% - 40px);
                    }

                    .clock {
                        width: 40px;
                        height: 40px;
                    }
                
                `}</style>
            </>
}