import {useState, useEffect, useRef} from 'react';
import '../../../../helper';
import Chart from 'chart.js';


function Canvas(props){
    const [viewData, setViewData] = useState(props.viewData);
    
    const root = useRef(null);

    useEffect(() => {
        let ctx = root.current.getContext("2d");
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.map(view => view.date.toLocaleYMString()),
                datasets: [{
                    label: "조회수",
                    backgroundColor: "#D6EAF8",
                    borderColor: "#3498DB",
                    data: viewData.map(view => view.count)
                }]
            },
            options: {
                scales: {
                xAxes: [
                    {
                        ticks: {
                            padding: 20
                        }
                    }
                ]  
                },
                layout: {
                    padding: {
                        left: 40,
                        right: 20,
                        bottom: 80,
                        top: 30,
                    }
                },
                legend: {
                    display: false
                }
            }
        })
    }, [viewData]);  

    return  <>
                <canvas 
                    ref={root}
                >
                    해당 브라우저는 Canvas 기능을 지원하지 않습니다. 
                    <a href="https://www.google.co.kr/chrome">최신 브라우저</a> 를 다운로드하여 이 기능을 이용하실 수 있습니다.
                </canvas>
            </>
}

export default function Detail(props){    
    // 데이터가 12개월 분만큼 존재하지 않는다면, 빈 데이터를 채워넣는다.
    let viewData = props.movie.view.map(v => ({date: new Date(v.date), count: v.count}));
    let _viewData = [];
    let now = new Date();
    let sinceLastYear = new Date(now.getFullYear(), now.getMonth() - 12, 1, 9, 0, 0);
    while(viewData[0].date > sinceLastYear){
        _viewData.push({date: new Date(sinceLastYear), count: 0});
        sinceLastYear.setMonth(sinceLastYear.getMonth() + 1);
    }
    viewData = _viewData.concat(viewData);

    _viewData = [];
    let thisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 9, 0, 0);
    while(viewData[viewData.length - 1].date < thisMonth){
        _viewData.unshift({date: new Date(thisMonth), count: 0});
        thisMonth.setMonth(thisMonth.getMonth() - 1);
    }
    viewData = viewData.concat(_viewData);
    

    return  <div>
                <div className="mb-3">
                    <p className="fx-3 font-weight-bold mb-2">월별 조회수 증가량 분석</p>
                    <p className="fx-n1 text-muted">해당 동영상의 조회수 증가에 대해 알아보세요!</p>
                </div>       
                <div className="canvas-wrap custom-scrollbar">
                    <Canvas viewData={viewData} />
                </div>
                <style jsx>{`
                    .canvas-wrap {
                        max-width: 100%;
                        height: 450px;
                        overflow-y: hidden;
                        overflow-x: auto;
                    }

                    select {
                        line-height: 1.5em;
                        padding: 0.2em 1em 0.2em 1em;
                    }
                `}</style>
            </div>
}