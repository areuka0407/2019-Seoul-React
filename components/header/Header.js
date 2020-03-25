import {useState, useEffect} from 'react';
import Link from "next/link";
import {useRouter} from 'next/router';
import Axios from "axios";

const NavItem = props => {
    const router = useRouter();
    return (
        <Link href={props.url}>
            <div className={"nav-item" + (router.pathname == props.url ? " active" : "")}>
                <a>{props.text}</a>
            </div>
        </Link>
    )
}


export default function Header(props){
    const [isLogined, setisLogined] = useState(false);


    useEffect(() => {

    }, []);


    const navList = [
        { text: "영화제 배급사", url: "/distributor" },
        { text: "추천 영화", url: "/movies/recommend" },
        { text: "예고편 업로드", url: "/movies/upload" },
        { text: "내 동영상", url: "/mypage" }
    ]
    const guestList = [
        { text: "로그인", url: "/sign-in" },
        { text: "회원가입", url: "/sign-up" }
    ]
    const userList = [
        { text: "로그아웃", url: "/logout" }
    ]

    let authList = isLogined;
    if(isLogined) authList = userList.map(({text, url}) => <NavItem key={text} text={text} url={url} />);
    else authList = guestList.map(({text, url}) => <NavItem key={text} text={text} url={url} />);
        

    return (
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
                    <div className="nav-list d-none d-lg-flex">
                        {navList.map(({text, url}) => <NavItem key={text} text={text} url={url} />)}
                    </div>
                    <div className="nav-list d-none d-lg-flex">
                        {authList}
                    </div>
                </div>
            </div>
        </header>
    )
}