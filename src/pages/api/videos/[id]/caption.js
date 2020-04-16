import Video from '../../../../../models/video';
import fs from 'fs';
import path from 'path';
import '../../../../../helper';

async function updateCaption(req, res){
    const {caption} = req.body;

    let video = await Video.findOne({idx: req.query.id});
    if(!video){
        res.status(405);
        return;
    }
    
    const root = process.env.ROOT;
    const savePath = path.join(root, "public", "caption");
    let existList = fs.readdirSync(savePath);
    let data = caption.list .sort((a, b) => a.startTime - b.startTime)
                            .map(data => `${data.startTime.sectodetailtime()} ~ ${data.endTime.sectodetailtime()}\r\n${data.text}\r\n\r\n`)
                            .reduce((p, c) => p + c, "");

    // 업로드한 자막이 없는 경우 => 새롭게 파일 생성
    let filename = video.caption;
    if(!existList.includes(filename)){
        let videoExt = path.extname(video.video);
        let videoName = path.basename(video.video, videoExt);
        video.caption = filename = videoName + ".txt";
        console.log(video);
        await video.save();
    }

    
    fs.writeFileSync(path.join(savePath, filename), data);
    res.status(200).json("성공적으로 자막이 업데이트 되었습니다.");
}

export default (req, res) => {
    switch(req.method){
        case "PUT":
            updateCaption(req, res);
            break;
    }
}