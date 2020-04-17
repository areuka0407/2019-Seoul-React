import Axios from 'axios';
import {useState} from 'react';
import {createToast} from '../../../../helper';

export default function Info(props){
    const {movie} = props;
    const [title, setTitle] = useState(movie.title);
    const [description, setDescription] = useState(movie.description);
    const [allowDownload, setAllowDownload] = useState(movie.allowed);

    const handleTitle = e => setTitle(e.nativeEvent.target.value);
    const handleDescription = e => setDescription(e.nativeEvent.target.value);
    const handleAllowDownload = e => setAllowDownload(e.target.checked);
    const handleSubmit = e => {
        e.preventDefault();

        Axios.put("/api/videos/" + movie.idx, {title, description, allowDownload})
        .then(res => {
            if(res.status === 200) {
                createToast("영상 수정 완료!", res.data, "success");
            } else {
                createToast("영상 수정 실패….", res.data);
            }
        });
    }

    return  <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <p className="fx-3 font-weight-bold mb-2">상세정보 수정</p>
                    <p className="fx-n1 text-muted">해당 영상의 정보를 수정해 보세요!</p>
                </div>       
                <div className="form-group">
                    <label className="fx-n2" htmlFor="movie_title">영상 제목</label>
                    <input type="text" id="movie_title" name="title" value={title} onChange={handleTitle} />
                </div>
                <div className="form-group">
                    <label className="fx-n2" htmlFor="movie_description">영상 설명</label>
                    <textarea id="movie_description" name="description" className="custom-scrollbar" rows="3" value={description} onChange={handleDescription} />
                </div>
                <div className="form-group d-flex align-items-center mt-4">
                    <input type="checkbox" id="allow_download" name="allow_download" checked={allowDownload} onChange={handleAllowDownload} hidden />
                    <label className="fx-n2 mb-0" htmlFor="allow_download">다운로드 허용</label>
                    <label htmlFor="allow_download" className={"custom-checkbox ml-3" + (allowDownload ? ' active' : '')}></label>
                </div>
                <div className="form-group mt-5">
                    <button className="fill-btn float-right" type="submit">수정하기</button>
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

                `}</style>
            </form>
}