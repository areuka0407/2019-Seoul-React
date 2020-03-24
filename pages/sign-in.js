import Link from 'next/link';
import React, {useState, useEffect} from 'react';

export default function Signin(){

    return (
        <div className="row full-height overflow-hidden mx-0">
            <div className="left col-lg-6 col-sm-12">
                <div className="padding-lg full-height-lg" style={{width: 480}}>     
                    <div className="text-center">
                        <div className="font-weight-bolder fx-5">로그인</div>
                        <div className="text-muted fx-n2 mt-3">부산국제영화제에 오신 것을 환영합니다!</div>
                    </div>
                    <form className="mt-5">
                        <div className="form-group">
                            <div className="label">
                                <label htmlFor="user_id" className="mb-0">아이디</label>
                            </div>
                            <div className="data">
                                <input type="text" id="user_id" name="user_id"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="label">
                                <label htmlFor="password" className="mb-0">비밀번호</label>
                            </div>
                            <div className="data">
                                <input type="password" id="password" name="password" autoComplete="off" />
                            </div>
                        </div>
                        <div className="form-group mt-5">
                            <button className="fill-btn w-100 py-2">
                                로그인
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="right col-lg-6 d-lg-flex d-none">
                <div className="text-white text-center" style={{width: 400}}>
                    <div className="font-weight-bolder fx-5">아직 계정이 없으신가요?</div>
                    <div className="fx-n2 mt-3">회원가입 후 부산국제영화제의 모든 서비스를 누려보세요!</div>
                    <Link href="/sign-up">
                        <button className="d-inline-block border-btn mt-5 px-5 py-2" style={{borderColor: "#fff"}}>바로가기</button>
                    </Link>
                </div> 
            </div>
            <style jsx>{`
                .left {
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: center;
                    padding-left: 10%;
                    padding-right: 128px;
                }

                .right {
                    position: relative;
                    z-index: 1;

                    padding-left: 128px;
                    padding-right: 10%;
                    display: flex;
                    align-items: center;
                }
                .right::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgb(27,43,82);
                    background-blend-mode: lighten;
                    background-image: url('/images/more_img_7.jpeg');
                    background-size: cover;
                    background-position: center center;
                    filter: brightness(50%);
                    z-index: -1;
                }

                @media(max-width: 992px) {
                    .right {
                        padding-left: 3em;
                        padding-right: 3em;
                    }
                    .right > div {
                        margin: 0 auto;
                    }
                }

                form {
                    width: 100%;
                    max-width: 480px;
                }

                .form-group {
                    display: flex;
                    align-items: center;
                }

                .label {
                    width: 150px;
                }

                .data {
                    width: calc(100% - 150px);
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
        </div>
    )
}