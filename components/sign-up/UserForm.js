import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import axios from 'axios';



toast.configure({ draggable: true });




export default function UserForm(props){
    const router = useRouter();
    const createToast = function(title, message){
        const toastInfo = {
            className: "bg-danger text-white",
            bodyClassName: "keep-all px-3 pt-2 pb-3",
            progressClassName: "bg-none bg-light",
            containerId: 'right'
        }
        toast(
        <>
            <div className="font-weight-bold">{title}</div>
            <div className="mt-1 fx-n4">{message}</div>
        </>,
        toastInfo)
        
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
    const userIdHandler = e => setUserId(e.target.value.trim());
    const passwordHandler = e => setPassword(e.target.value.trim());
    const nameHandler = e => setName(e.target.value.trim());
    const profileHandler = e => {
        if(e.target.files.length === 0) return;

        let error = 0;
        const file = e.target.files[0];
        const allowExts = ['PNG', 'JPG'];
        const fileExt = file.name.substr(-3).toUpperCase();
        if(!allowExts.includes(fileExt)){
            e.preventDefault();
            createToast("이미지 포맷 오류", allowExts.join(", ") + " 이미지 확장자 파일만 사용하실 수 있습니다.");
            error++;
        }
        if(file.size > 1024 * 1024){
            e.preventDefault();
            createToast("이미지 용량 초과", "1MB가 넘는 이미지는 사용하실 수 없습니다.");
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

    const handleSubmit = async e => {
        e.preventDefault();

        let error = 0;

        if(!/^[a-zA-Z0-9]{4,8}$/.test(userId)){
            createToast("아이디 입력 오류", "아이디는 [영문/숫자]로 4~8자 이내여야 합니다.");
            error++;    
        }
        if(!/^(?=.*[a-zA-Z]+.*)(?=.*[0-9]+.*)([a-zA-Z0-9]{8,12})$/.test(password)){
            createToast("비밀번호 입력 오류", "비밀번호는 [영문/숫자]가 모두 포함되어야 하며, 8~12자 이내여야 합니다.");
            error++;
        }
        if(!/^([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]{2,10})$/.test(name)){
            createToast("기업명 입력 오류", "기업명은 [영문/한글/숫자/공백]로 4~10자 이내여야 합니다.");
            error++;
        }
        if(typeof profile.name == 'undefined'){
            createToast("로고 업로드 오류", "로고를 업로드해 주십시오.");
            error++;
        }

        let sameIdList = (await axios.get("/api/users?id=" + userId)).data
        if(sameIdList.length > 0){
            createToast("중복된 아이디", "해당 아이디의 계정이 이미 존재합니다.");
            error++;
        }

        if(error === 0){
            axios.post("/api/users", {userId, password, name, profile: profile.src})
            .then(({data}) => {
                if(data.n === 1 && data.ok == 1) {
                    router.replace('/sign-in');
                }
                else {
                    createToast("회원가입 오류 발생!", "알 수 없는 에러가 발생하여 회원가입을 하실 수 없습니다.. 나중에 다시 시도하거나 관리자에게 연락하시기 바랍니다.");
                }
            });   
        }
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