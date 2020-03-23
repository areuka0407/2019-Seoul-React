import React from "react";
import Link from "next/link";
import {useRouter} from 'next/router';

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

export default class Header extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            navList: [
                { text: "영화제 배급사", url: "/distributor" },
                { text: "추천 영화", url: "/movies/recommand" },
                { text: "예고편 업로드", url: "/movies/upload" },
                { text: "내 동영상", url: "/mypage" }
            ],
            guestList: [
                { text: "로그인", url: "/sign-in" },
                { text: "회원가입", url: "/sign-up" }
            ],
            userList: [
                { text: "로그아웃", url: "/logout" }
            ],
            isLogined: false
        };
    }

    render(){
        let navList = this.state.navList.map(({text, url}) => <NavItem key={text} text={text} url={url} />);
        let authList = this.state.isLogined;
        if(this.state.isLogined) authList = this.state.userList.map(({text, url}) => <NavItem key={text} text={text} url={url} />);
        else authList = this.state.guestList.map(({text, url}) => <NavItem key={text} text={text} url={url} />);

            

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
                            {navList}
                        </div>
                        <div className="nav-list d-none d-lg-flex">
                            {authList}
                        </div>
                    </div>
                </div>
            </header>
        )
    }
};