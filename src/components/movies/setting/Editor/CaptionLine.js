import {useState, useEffect, useRef} from 'react';

function CaptionItem(props){
    const {info, movie, active, onChangeTime, onClick} = props;
    const [width, setWidth] = useState(0);
    const [left, setLeft] = useState(0);

    const handleClick = e => {
        onChangeTime(info.startTime);
        onClick(e);
    }

    useEffect(() => {
        let duration = info.endTime - info.startTime;
        let width = 100  * duration / movie.duration;
        let left = 100 * info.startTime / movie.duration;
        
        setWidth(width);
        setLeft(left);
    }, []);
    

    return  <div 
                className={"box" + (active ? " active" : "")} 
                title={info.startTime.sectodetailtime() + " ~ " + info.endTime.sectodetailtime()} 
                onClick={handleClick}
            >
                <style jsx>{`
                    .box {
                        position: absolute;
                        height: 100%;
                        top: 0;
                        left: ${left}%;
                        width: ${width}%;
                        background-color: #333;
                        cursor: pointer;
                    }
                    
                    .box.active {
                        background-color: #3486BB;
                    }
                `}</style>
            </div>
}


export default function CaptionLine(props){
    const {caption, movie, target, onChangeTime, onChangeTarget} = props;

    const handleClickItem = (e, item) => {
        e.stopPropagation();
        onChangeTarget(item.idx);
    }

    return  <div className="caption-line" onClick={() => onChangeTarget(null)}>
                { 
                    caption.list.map(item => <CaptionItem 
                        key={item.idx} 
                        info={item} 
                        movie={movie} 
                        active={item.idx === target}
                        onChangeTime={onChangeTime}
                        onClick={e => handleClickItem(e, item)}
                    />) 
                }

                <style jsx>{`
                    .caption-line {
                        position: relative;
                        width: 100%;
                        height: 50px;
                        background-color: #eee;
                    }
                `}</style>
            </div>
}