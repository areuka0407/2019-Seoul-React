import {useState, useEffect} from 'react';
import Axios from 'axios';
import {toast} from 'react-toastify';

toast.configure({draggable: true});

export default function LoginForm(props){
    const createToast = function(title, message, type = "danger"){
        const toastInfo = {
            className: `bg-${type} text-white`,
            bodyClassName: "keep-all px-3 pt-2 pb-3",
            progressClassName: "bg-none bg-light",
            containerId: 'left'
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

    /**
     * handles
     */

    const userIdHandler = e => setUserId(e.target.value.trim());
    const passwordHandler = e => setPassword(e.target.value.trim());
    const handleSubmit = e => {
        e.preventDefault();

        Axios.post("/api/sessions", {userId, password})
        .then(({data}) => {
            if(data.type === "danger"){ 
                createToast("로그인 오류!", data.message);
            }
            else {
                createToast("로그인 성공!", data.message, data.type);
            }
        });
    };

    /**
     * effects
     */
    useEffect(() => {
        const form = document.querySelector("#login-form");
        form.addEventListener("submit", handleSubmit);
        return () => {
            form.removeEventListener("submit", handleSubmit);
        }
    }, [userId, password]);

    return (
        <form id="login-form" className={props.className}>
            <div className="form-group">
                <div className="label">
                    <label htmlFor="user_id" className="mb-0">아이디</label>
                </div>
                <div className="data">
                    <input type="text" id="user_id" name="userId" value={userId} onChange={userIdHandler} />
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
            <div className="form-group mt-5">
                <button className="fill-btn w-100 py-2">
                    로그인
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