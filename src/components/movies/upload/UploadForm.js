import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Axios from 'axios';
import {toast} from 'react-toastify';
import {createToast} from '../../../../helper';

toast.configure({
    autoClose: false,
    draggable: true
});

export default function UploadForm(props){
    const router = useRouter();
    const toastInfo = {
        className: "react-toast bg-danger text-white",
        bodyClassName: "keep-all fx-n2 px-3 pt-2 pb-4",
        progressClassName: "bg-light",
        containerId: 'center'
    };

    /**
     * State
     */
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(['']);
    const [allowDownload, setAllowDownload] = useState(false);
    const [video, setVideo] = useState({});
    const [thumbnail, setThumbnail] = useState('');
    const [useVideoThumbnail, setUseVideoThumbnail] = useState(false);
    const [timeline, setTimeline] = useState(0);


    /**
     * Handler
     */
    const handlerTitle = e => setTitle(e.target.value);
    const handlerDescription = e => setDescription(e.target.value);
    const handlerAllowDownload = e => setAllowDownload(e.target.checked);
    const handlerUseVideoThumbnail = e => {
        let checked = e.target.checked;
        if(!checked && useVideoThumbnail && thumbnail !== ''){
            setThumbnail('');
        }
        else if(checked && video){
            getVideoThumbnail(video, 0)
            .then(url => setThumbnail(url));
        }
        setTimeline(0);
        setUseVideoThumbnail(checked);
    };
    const handlerTimeline = async e => {
        const timeline = parseInt(e.target.value);
        const thumbnailURL = await getVideoThumbnail(video, timeline);

        setTimeline(timeline);
        setThumbnail(thumbnailURL);
    }
    const handlerVideo = e => {
        if(e.target.files.length === 0) return;

        const file = e.target.files[0];


        // Validation
        const allowExtension = ["MP4"];
        const uploadExt = file.name.substr(-3).toUpperCase();
        if(!allowExtension.includes(uploadExt)){
            e.preventDefault();
            toast(allowExtension.join(", ") + " 비디오 확장자만 업로드 하실 수 있습니다.", toastInfo);
        }
        else if(file.type.substr(0, 5) !== "video"){
            e.preventDefault();
            toast("비디오 파일포맷이 아닙니다.", toastInfo);
        }
        else if(file.size > 1024 * 1024 * 50){
            e.preventDefault();
            toast("50MB가 넘는 영상은 업로드 하실 수 없습니다.", toastInfo);
        }

        // Upload
        else {
            const video = document.createElement("video")
            video.src = URL.createObjectURL(file);
            video.name = file.name;
            video.file = file;
            video.onloadedmetadata = () => {
                setVideo(video);
                setTimeline(0);

                if(useVideoThumbnail) {
                    getVideoThumbnail(video, 0)
                    .then(url => setThumbnail(url));
                }
            }
        }
    }
    const handlerThumbnail = e => {
        if(e.target.files.length === 0) return;

        const file = e.target.files[0];
        // validation
        const allowExtension = ['JPG', 'PNG'];
        const uploadExt = file.name.substr(-3).toUpperCase();
        if(!allowExtension.includes(uploadExt)){
            e.preventDefault();
            toast(allowExtension.join(", ") + " 이미지 확장자 파일만 업로드하실 수 있습니다.", toastInfo);
        }
        else if(file.size > 1024 * 1024){
            e.preventDefault();
            toast("1MB가 넘는 파일은 업로드하실 수 없습니다.", toastInfo);
        }

        // upload
        else {
            let thumbnailURL = URL.createObjectURL(file);
            console.log(thumbnailURL);
            setThumbnail(thumbnailURL);
        }
    };
    
    const handlerSubmit = async e => {
        e.preventDefault();
        if(title.trim() === ""){
            createToast("영상 제목을 입력해 주세요!");
        } else if(description.trim() === ""){
            createToast("영상 설명을 입력해 주세요!");
        } else if(!video || !video.src){
            createToast("영상을 업로드해 주세요!");
        } else if(thumbnail === "" || !thumbnail) {
            createToast("섬네일을 업로드해 주세요!");
        } else {
            const MB50 = 1024 * 1024 * 50;
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("allowed", allowDownload);
            formData.append("thumbnail", thumbnail);
            formData.append("video", video.file);
            formData.append("duration", video.duration);

            Axios.post("/api/videos", formData, {
                maxContentLength: MB50,
                maxBodyLength: MB50,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(res => {
                if(res.status === 200){
                    createToast("업로드 성공!", "새로운 영화가 업로드 될 겁니다! 모두가 이걸 좋아하면 좋겠네요!", "success");
                    router.replace("/");
                }
                else {
                    createToast("업로드 실패….", res.data);
                }
            });
        }
    }

    /**
     * Effect
     */
    useEffect(() => {
        document.querySelector("#movie_file").addEventListener("input", handlerVideo);
        document.querySelector("#thumbnail").addEventListener("input", handlerThumbnail);
        return () => {
            document.querySelector("#movie_file").removeEventListener("input", handlerVideo);
            document.querySelector("#thumbnail").removeEventListener("input", handlerThumbnail);
        };
    }, [useVideoThumbnail]);


    /****/

    const issetVideo = typeof video.src !== 'undefined';
    


    return (
        <form method="post" encType="multipart/form-data" autoComplete="off" onSubmit={handlerSubmit}>
            <div className="row">
                <div className="col-sm-12 col-md-3 py-2 px-4">
                    <span className="font-weight-bold fx-2">영화 정보</span>
                </div>
                <div className="col-sm-12 col-md-9 py-2 px-4">
                    <div className="form-group">
                        <label className="fx-n2" htmlFor="movie_title">영상 제목</label>
                        <input type="text" id="movie_title" name="title" value={title} onChange={handlerTitle} />
                    </div>
                    <div className="form-group">
                        <label className="fx-n2" htmlFor="movie_description">영상 설명</label>
                        <textarea id="movie_description" name="description" className="custom-scrollbar" rows="3" value={description} onChange={handlerDescription} />
                    </div>
                    <div className="form-group d-flex align-items-center mt-4">
                        <input type="checkbox" id="allow_download" name="allow_download" checked={allowDownload} onChange={handlerAllowDownload} hidden />
                        <label className="fx-n2 mb-0" htmlFor="allow_download">다운로드 허용</label>
                        <label htmlFor="allow_download" className={"custom-checkbox ml-3" + (allowDownload ? ' active' : '')}></label>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-sm-12 col-md-3 pt-4 pb-2 px-4">
                    <span className="font-weight-bold fx-2">파일 정보</span>
                </div>
                <div className="col-sm-12 col-md-9 pt-4 pb-2 px-4">
                    <div className="form-group">
                        <label className="fx-n2" htmlFor="movie_file">영상 파일</label>
                        <input type="file" id="movie_file" name="movie_file" accept="video/*" hidden />
                        <label htmlFor="movie_file" className="custom-file">{video.name ? video.name : '파일을 업로드해 주세요…'}</label>
                    </div>
                    <div className={"form-group align-items-center my-4" + (issetVideo ? ' d-flex' : ' d-none')}>
                        <input type="checkbox" id="use-video-thumbnail" name="use-video-thumbnail" checked={useVideoThumbnail} onChange={handlerUseVideoThumbnail} hidden />
                        <label className="fx-n2 mb-0" htmlFor="use-video-thumbnail">영상을 섬네일로 사용</label>
                        <label htmlFor="use-video-thumbnail" className={"custom-checkbox ml-3" + (useVideoThumbnail ? ' active' : '')}></label>
                    </div>
                    <div className={"form-group mb-5" + (useVideoThumbnail ? " d-block" : ' d-none')}>
                        <label className="fx-n2" htmlFor="timeline">타임라인</label>
                        <small className="ml-2 fx-n4 text-muted">섬네일로 사용할 영상 시간대를 설정하세요</small>
                        <div className="d-flex align-items-center mt-2">
                            <div className="time-view">
                                {timeline.sectotime()}
                            </div>
                            <input type="range" id="timeline" className="range" min="0" max={video.duration} value={timeline} onChange={handlerTimeline} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="fx-n2" htmlFor="thumbnail">섬네일 이미지</label>
                        <small className="ml-2 fx-n4 text-muted">영상을 업로드하여 섬네일을 추출하거나 하단 박스를 눌러 이미지를 업로드하세요</small>
                        <input type="file" id="thumbnail" name="thumbnail" accept="image/*" disabled={issetVideo ? '' : 'disabled'} hidden />
                        <label htmlFor="thumbnail" className="custom-thumbnail mt-2">{thumbnail ? '' : '섬네일 이미지'}</label>
                    </div>
                    <div className="form-group mt-5">
                        <button className="fill-btn float-right" type="submit">업로드</button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                input:not([type='files']):not(.range), textarea {
                    display: block;
                    width: 100%;
                    border: 1px solid #ddd;
                    padding: 0.7em 0.8em;
                    font-size: 0.85em;
                    outline: none;
                    background-color: #fff;
                }

                textarea {
                    resize: none;
                }

                .custom-checkbox {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border: 1px solid #aaa;
                    margin: 0;
                }

                .custom-checkbox.active {
                    border: 3px solid #3486BB;
                }

                .custom-file {
                    display: block;
                    padding: 0.7em 0.8em;
                    font-size: 0.85em;
                    border: 1px solid #ddd;
                    background-color: #fff;
                    height: auto;
                    color: #888;
                }

                .custom-thumbnail {
                    width: 512px;
                    height: 256px;
                    display: block;
                    border: 1px solid #ddd;
                    text-align: center;
                    line-height: 256px;
                    font-size: 0.9em;
                    color: #555;
                    background-color: #eee;
                    background-image: ${thumbnail ? 'url('+thumbnail+')' : 'none'};
                    background-size: cover;
                }

                .time-view {
                    color: #3486BB;
                    margin-right: 10px;
                }

                .range {
                    display: block;
                    width: 472px;
                    box-shadow: 0 1px 3px 1px #0002;
                }
            `}</style>
        </form>
    )
}


function getVideoThumbnail(video, timeline){
    return new Promise(res => {
        video.currentTime = timeline;
        video.onseeked = () => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = 512;
            canvas.height = 256;

            ctx.drawImage(video, 0, 0, 512, 256);
            res(canvas.toDataURL('image/jpeg'));
        }
    });
}