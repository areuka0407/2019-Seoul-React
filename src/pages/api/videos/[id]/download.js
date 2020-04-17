import path from 'path';
import fs from 'fs';
import Video from '../../../../../models/video';

export default async (req, res) => {
    let video = await Video.findOne({idx: req.query.id});
    if(!video){
        res.status(404).send("해당 동영상을 찾을 수 없습니다.");
    }
    else if(video.allowed == false){
        res.status(403).send("해당 파일은 다운로드 될 수 없습니다.");
    }
    else {
        const root = process.env.ROOT;
        const filePath = path.join(root, "public", "video");

        let videoExt = path.extname(video.video);
        let readfile = fs.readFileSync(path.join(filePath, video.video))
        
        video.download++;
        await video.save();
        
        res.setHeader("Content-Type", "video/" + videoExt);
        res.setHeader("Content-Disposition", "attachment; filename=" + new Date().getTime() + videoExt);
        res.send(readfile);
        
    }
}