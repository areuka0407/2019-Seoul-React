import Video from '../../../../models/video';

async function selectVideo(req, res){
    let video = await Video.findOne({idx: req.query.id});
    res.status(200).json(video);
}

async function updateVideo(req, res){
    const {title, description, allowDownload} = req.body;
    
    let video = await Video.findOne({idx: req.query.id});

    // 데이터 무결성 검사
    if(!video) {
        res.status(404).send("해당 영상을 찾을 수 없습니다.");
    } else if(!title || title.trim() === ""){
        res.status(400).send("영상 제목을 입력해 주세요!");
    } else if(!description || description.trim() === ""){
        res.status(400).send("영상 설명을 입력해 주세요!");
    } else if(typeof req.body.allowDownload === 'undefined' || allowDownload === null){
        res.status(400).send("다운로드 여부를 결정해 주세요!");
    }

    video.title = title;
    video.description = description;
    video.allowed = allowDownload;
    await video.save();

    res.status(200).send("영상이 정상적으로 수정되었습니다.");
}



export default (req, res) => {
    switch(req.method){
        case "GET":
            selectVideo(req, res);
        case "PUT":
            updateVideo(req, res);
    }
}