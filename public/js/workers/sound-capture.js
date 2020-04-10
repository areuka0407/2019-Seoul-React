onmessage = e => {
    // 높이는 100px, 값이 -1 ~1 사이 내의 값으로 존재할 텐데, 이에 맞춰 높이 값을 조절해야한다. 

    let {buffer, canvas} = e.data;
    let {width, height} = canvas;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#3A93D2";

    // 한 픽셀당 포함 될 데이터의 양
    let unit = Math.ceil(buffer.length / width); 
    
    
    let drawPixel = 0;      // 현재 그린 픽셀 수
    let processIdx = 0;   // 현재 버퍼 진행도
    
    (function render(){
        let max = Math.max(...buffer.slice(processIdx, processIdx + unit));
        let min = Math.min(...buffer.slice(processIdx, processIdx + unit));
        
        let h = Math.max(1, (max - min) * height / 2);
        let y = height / 2 - h / 2;
        ctx.fillRect(drawPixel++, y, 1, h);

        if(processIdx < buffer.length){
            processIdx += unit
            requestAnimationFrame(render);
        }
        else {
            postMessage({resolve: true});
        }
    })();
}