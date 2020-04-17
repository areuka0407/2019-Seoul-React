import Video from '../../../models/video';
import User from '../../../models/user';
import {randomStr} from '../../../helper';
import fs, { writeFileSync } from 'fs';
import path from 'path';

// multer 설정
import multer from 'multer';
const upload = multer({
  dest: 'temp',
  limits: 1024 * 1024 * 50,
});

function getVideo(req, res){
    Video.findOne({idx: req.query.id})
    .populate("user")
    .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "id name img",
        }
    })
    .exec((err, video) => {
        if(err) 
            res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
        else 
            res.status(200).json({result: true, video});
    });
}

function getVideoList(req, res){
    Video.find()
    .populate("user")
    .exec((err, videoList) => {
        if(err) 
            res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
        else 
            res.status(200).json({result: true, videoList});
    });
}

function getVideoListByUser(req, res){
    User.findOne({idx: req.query.user})
    .then(user => {
        Video.find({user})
        .populate("user")
        .exec((err, videoList) => { 
            if(err) 
                res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
            else 
                res.status(200).json({result: true, videoList});
        });
    });
}

function getVideoListOnlyMine(req, res){
    if(!req.session.user){
        res.status(200).json({videoList: []});
    }
    else {
        Video.find({user: req.session.user})
        .populate('user')
        .exec((err, videoList) => {
            if(err) 
                res.status(404).json({result: false, message: "데이터를 가져오지 못했습니다.."});
            else 
                res.status(200).json({result: true, videoList});
        });

    }
}

async function insertVideo(req, res){
    // 업로드 권한 검사

    if(typeof req.session.user === 'undefined' || !req.session.user){
        res.status(403).send("해당 요청을 실행할 권한이 없습니다!");
        return;
    }


    upload.single("video")(req, {}, err => {
        const root = process.env.ROOT;
        const imagePath = path.join(root, "public", "images", "thumbnails");
        const videoPath = path.join(root, "public", "video");

        const file = req.file;
        const {
            title, 
            description, 
            allowed, 
            thumbnail,
            duration
        } = req.body;


        // 텍스트 데이터 검증
        if(title.trim() === ""){
            res.status(400).send("영상 제목을 입력해 주세요!");
            return
        } else if(description.trim() === ""){
            res.status(400).send("영상 설명을 입력해 주세요!");
            return
        } else if(typeof req.body.allowed === 'undefined' || allowed === null){
            res.status(400).send("다운로드 여부를 입력해 주세요!");
            return
        } else if(thumbnail === "" || !thumbnail) {
            res.status(400).send("섬네일을 업로드해 주세요!");
            return;
        } else if(!duration || ! parseFloat(duration)){
            res.status(400).send("영상의 재생시간을 입력해 주세요!");
        }

        // 이미지 데이터 검증
        let matches = thumbnail.match(/data:image\/(?<ext>jpeg|png);base64,(?<data>.+)/);
        console.log(thumbnail, matches);
        let imageData = matches.groups.data;
        let imageExt = "." + matches.groups.ext;

        if(!matches){
            res.status(400).send("올바른 형식의 데이터가 아닙니다.");
            return;
        }


        // 비디오 데이터 검증
        if(file.mimetype.substr(0,5) !== "video"){
            res.status(400).send("올바른 형식의 영상이 아닙니다.");
            return;
        } else if(file.size > 1024 * 1024 * 50){
            res.status(400).send("영상의 크기는 50MB 이내여야 합니다.");
            return;
        }

        // 파일 업로드 시작!
        let filename = (new Date().getTime() + randomStr(20));
        
        // 이미지 업로드
        fs.writeFileSync(
            path.join(imagePath, `${filename}.${imageExt}`), 
            imageData
        );

        // 비디오 업로드
        const videoExt = file.mimetype.substr( file.mimetype.indexOf('/') + 1 );
        fs.renameSync(
            path.join(root, file.path),
            path.join(videoPath, `${filename}.${videoExt}`)
        );

        // DB에 모든 내용 저장
        const video = new Video();
        video.title = title;
        video.description = description;
        video.allowed = allowed;
        video.video = filename + "." + videoExt;
        video.thumbnail = filename + "." + matches.groups.ext;
        video.user = req.session.user._id;
        video.date = new Date();
        video.duration = duration;
        video.caption = null;
        video.download = 0;

        video.save()
        .then(() => {
            res.status(200).json("업로드 성공!");
        })

    });
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default (req, res) => {
    switch(req.method){
        case "GET": 
            if(req.query.id)  
                getVideo(req, res);
            else if(req.query.user)
                getVideoListByUser(req, res);
            else if(req.query['only-mine'])
                getVideoListOnlyMine(req, res);
            else
                getVideoList(req, res);
            break;
        case "POST":
            insertVideo(req, res);
    }
};  