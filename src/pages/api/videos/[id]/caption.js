import Video from '../../../../../models/video';
import fs, { readFile } from 'fs';
import path from 'path';
import '../../../../../helper';

async function downloadCaption(req, res){
    let video = await Video.findOne({idx: req.query.id}).populate("user");
    if(!video){
        res.status(404).send("요청한 영화를 찾을 수 없습니다.");
        return;
    }

    if(!req.session.user || video.user.idx !== req.session.user.idx){
        res.status(403).send("다운로드할 권한이 없습니다.");
        return;
    }

    const root = process.env.ROOT;
    const filePath = path.join(root, "public", "caption");

    let data = fs.readFileSync(path.join(filePath, video.caption));

    res.setHeader("Content-Type", "text/text");
    res.setHeader("Content-Disposition", "attachment; filename=" + new Date().getTime() + ".txt");
    res.send(data);
}

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
        case "GET":
            downloadCaption(req, res);
            break;
        case "PUT":
            updateCaption(req, res);
            break;
    }
}