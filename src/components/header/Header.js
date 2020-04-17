import Link from "next/link";
import Axios from "axios";
import {useState} from 'react';
import {useRouter} from 'next/router';
import {createToast} from '../../../helper';

const NavItem = props => {
    const {url, text} = props;
    const router = useRouter();
    return (
        <Link href={url}>
            <div className={"nav-item" + (router.pathname == url ? " active" : "")}>
                <a>{text}</a>
            </div>
        </Link>
    )
}


function Header(props){
    const router = useRouter();
    const [active, setActive] = useState(false);

    const handleLogout = () => {
        Axios.delete("/api/sessions")
        .then(() => {
            createToast("로그아웃!", "이용해주셔서 감사합니다.", "success");
            router.replace("/");
            props.onLogout();
            handleClick();
        });
    }

    const handleClick = () => setActive(false);
    
    return (
        <>
            <header>
                <div className="container-fluid h-100">
                    <div className="d-flex justify-content-between align-items-center h-100">
                        <div className="d-flex align-items-center">
                            <Link href="/index" as="/">
                                <a className="logo mr-1">
                                    <img src='/images/Llogo.png' height="60" />
                                </a>
                            </Link>
                        </div>
                        <div className="nav-list d-none d-lg-flex position-center">
                            <NavItem text={"영화제 배급사"} url={"/distributor"} onClick={handleClick} />
                            <NavItem text={"추천 영화"} url={"/movies/recommend"} onClick={handleClick} />
                            <NavItem text={"예고편 업로드"} url={"/movies/upload"} onClick={handleClick} />
                            <NavItem text={"내 동영상"} url={"/mypage"} onClick={handleClick} />
                        </div>
                        <div className="nav-list d-none d-lg-flex">
                            {
                                props.user ? 
                                    <>
                                        <div key='user-info' className="nav-item">
                                            <span className="fx-n2">{props.user ? props.user.name : ""}님 안녕하세요!</span>
                                        </div>
                                        <div key='logout' className="nav-item" onClick={handleLogout}>
                                            <a>로그아웃</a>
                                        </div>
                                    </>
                                : 
                                    <>
                                        <NavItem text={"로그인"} url={"/sign-in"} onClick={handleClick} />
                                        <NavItem text={"회원가입"} url={"/sign-up"} onClick={handleClick} />
                                    </>
                            }
                        </div>
                        <div className={"menu-icon d-lg-none" + (active ? " active" : "")} onClick={() => setActive(!active)}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div className={"d-lg-none mobile-nav" + (active ? " active" : "")}>
                    <div className="position-center">
                        <div className="d-flex flex-column align-items-center text-white">
                            <Link href={"/distributor"}>
                                <a onClick={handleClick} className="text-white fx-4 my-3">영화제 배급사</a>
                            </Link>
                            <Link href={"/movies/recommend"}>
                                <a onClick={handleClick} className="text-white fx-4 my-3">추천 영화</a>
                            </Link>
                            <Link href={"/movies/upload"}>
                                <a onClick={handleClick} className="text-white fx-4 my-3">예고편 업로드</a>
                            </Link>
                            <Link href={"/mypage"}>
                                <a onClick={handleClick} className="text-white fx-4 my-3">내 동영상</a>
                            </Link>
                            {
                                props.user ?
                                <a className="text-white fx-4 my-3" onClick={handleLogout}>로그아웃</a>
                                :
                                <div className="mt-4 d-flex">
                                    <Link href="sign-in">
                                        <a onClick={handleClick} className="text-white mr-3 fx-2">로그인</a>
                                    </Link>
                                    <Link href="sign-up">
                                        <a onClick={handleClick} className="text-white fx-2">회원가입</a>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <style jsx>{`
                .menu-icon {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    position: relative;
                    cursor: pointer;
                    z-index: 101;
                }

                .menu-icon div {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 30px;
                    height: 1px;
                    margin-left: -15px;
                    background-color: #fff;
                    transition: 0.5s;
                    filter: brightness(20%);
                }


                .menu-icon div:first-child { margin-top: -10px; }
                .menu-icon div:last-child { margin-top: 10px; }

                .menu-icon.active div { filter: brightness(100%); }
                .menu-icon.active div:not(:first-child):not(:last-child) { opacity: 0; margin-top: 0; transform: rotate(45deg); }
                .menu-icon.active div:first-child { margin-top: 0; transform: rotate(45deg); }
                .menu-icon.active div:last-child { margin-top: 0; transform: rotate(-45deg); }


                .mobile-nav {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-color: #000a;
                    z-index: 100;
                    transition: 0.5s;
                    opacity: 0;
                    pointer-events: none;
                }

                .mobile-nav.active {
                    opacity: 1;
                    pointer-events: all;
                }
            `}</style>
        </>
    )
}
export default Header;