import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';



toast.configure({ draggable: true });




export default function UserForm(props){
    const toastInfo = {
        className: "bg-danger text-white",
        bodyClassName: "keep-all fx-n2 px-3 pt-2 pb-3",
        progressClassName: "bg-none bg-light",
        containerId: 'right'
    }

    /**
     * useState
     */
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState({});

    /**
     * eventHandler
     */
    const userIdHandler = e => setUserId(e.target.value);
    const passwordHandler = e => setPassword(e.target.value);
    const nameHandler = e => setName(e.target.value);
    const profileHandler = e => {
        if(e.target.files.length === 0) return;

        let error = 0;
        const file = e.target.files[0];
        const allowExts = ['PNG', 'JPG'];
        const fileExt = file.name.substr(-3).toUpperCase();
        if(!allowExts.includes(fileExt)){
            e.preventDefault();
            toast(allowExts.join(", ") + " 이미지 확장자 파일만 사용하실 수 있습니다.", toastInfo);
            error++;
        }
        if(file.size > 1024 * 1024){
            e.preventDefault();
            toast("1MB가 넘는 이미지는 사용하실 수 없습니다.", toastInfo);
            error++;
        }

        if(error == 0) {
            new Promise(res => {
                let reader = new FileReader();
                reader.onload = () => res(reader.result);
                reader.readAsDataURL(file);
            }).then(url => new Promise(res => {
                let image = document.createElement("img");
                image.src = url;
                image.name = file.name;
                setProfile(image);
            }))
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        let error = 0;

        if(!/^[a-zA-Z0-9]{4,8}$/.test(userId)){
            toast("아이디는 [영문/숫자]로 4~8자 이내여야 합니다.", toastInfo);
            error++;    
        }
        if(!/^(?=.*[a-zA-Z]+.*)(?=.*[0-9]+.*)([a-zA-Z0-9]{8,12})$/.test(password)){
            toast("비밀번호는 [영문/숫자]가 모두 포함되어야 하며, 8~12자 이내여야 합니다.", toastInfo);
            error++;
        }
        if(!/^([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]{2,10})$/.test(name)){
            toast("기업명은 [영문/한글/숫자/공백]로 4~10자 이내여야 합니다.", toastInfo);
            error++;
        }
        if(typeof profile.name == 'undefined'){
            toast("로고를 업로드해 주십시오.", toastInfo);
            error++;
        }

        axios.post("/api/users", {userId, password, name, profile: profile.src})
        .then(({data}) => {
            console.log(data);
        });
    };

    /**
     * effect
     */
    useEffect(() => {
        const $profile = document.querySelector("#profile");
        $profile.addEventListener("input", profileHandler);
    }, []);
    

    /*********/

    const issetProfile = typeof profile.name !== 'undefined';

    return (
        <form className="mt-5" onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="label">
                    <label htmlFor="user_id" className="mb-0">아이디</label>
                </div>
                <div className="data">
                    <input type="text" id="user_id" name="user_id" value={userId} onChange={userIdHandler} />
                </div>
            </div>
            <div className="form-group">
                <div className="label">
                    <label htmlFor="password" className="mb-0">비밀번호</label>
                </div>
                <div className="data">
                    <input type="password" id="password" name="password" value={password} onChange={passwordHandler} autoComplete="off" />
                </div>
            </div>
            <div className="form-group">
                <div className="label">
                    <label htmlFor="user_name" className="mb-0">기업명</label>
                </div>
                <div className="data">
                    <input type="text" id="user_name" name="user_name" value={name} onChange={nameHandler} />
                </div>
            </div>
            <div className="form-group">
                <div className="label">
                    <label htmlFor="profile" className="mb-0">기업 로고</label>
                </div>
                <div className="data">
                    <label htmlFor="profile" className="profile-label fx-n2">
                        {
                            issetProfile ?
                            profile.name
                            : '파일을 업로드 하세요…'
                        }
                    </label>
                    <input type="file" id="profile" name="profile" className="profile-input" hidden/>
                </div>
            </div>
            <div className="form-group mt-5">
                <button className="fill-btn w-100 py-2">
                    회원가입
                </button>
            </div>
            <style jsx>{`
                form {
                    width: 100%;
                    max-width: 480px;
                }

                .form-group {
                    display: flex;
                    align-items: center;
                }

                .label {
                    width: 100px;
                }

                .data {
                    width: calc(100% - 100px);
                }

                input, .profile-label {
                    width: 100%;
                    background-color: transparent;
                    border: none;
                    border-bottom: 1px solid #aaa;
                    padding: 0.3em 0.8em;
                    color: #555;
                    outline: none;
                }
            `}</style>
        </form>

    )
}