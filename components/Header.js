import React from "react";
import Link from "next/link";

const NavArea = () => {
    return (
        <div>
            <div className="desktop fx-n1">
                <Link href="/">
                    <a>영화제 배급사</a>
                </Link>
                <Link href="/profile">
                    <a>추천 영화</a>
                </Link>
                <Link href="/profile">
                    <a>예고편 업로드</a>
                </Link>
                <Link href="/profile">
                    <a>내 동영상</a>
                </Link>
            </div>
        </div>
    )
}

const NavItem = props => (
    <Link href={props.url}>
        <div className="nav-item">
            <a>{props.text}</a>
        </div>
    </Link>
)



export default class Header extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            navList: [
                { text: "영화제 배급사", url: "/distributor" },
                { text: "추천 영화", url: "/recommand/movies" },
                { text: "예고편 업로드", url: "/upload/movies" },
                { text: "내 동영상", url: "/mypage/movies" }
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
        let navList = this.state.navList.map(({text, url}) => <NavItem text={text} url={url} />);
        let authList = this.state.isLogined;
        if(this.state.isLogined) authList = this.state.userList.map(({text, url}) => <NavItem text={text} url={url} />);
        else authList = this.state.guestList.map(({text, url}) => <NavItem text={text} url={url} />);

            

        return (
            <header>
                <div className="container-fluid h-100">
                    <div className="d-flex justify-content-between align-items-center h-100">
                        <div class="d-flex align-items-center">
                            <Link href="/">
                                <a className="logo mr-1">
                                    <img src='/images/Slogo.png' height="60" />
                                </a>
                            </Link>
                        </div>
                        <div class="nav-list d-flex">
                            {navList}
                        </div>
                        <div class="nav-list d-flex">
                            {authList}
                        </div>
                    </div>
                </div>
            </header>
        )
    }
};