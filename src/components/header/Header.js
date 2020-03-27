import Link from "next/link";
import {useRouter} from 'next/router';
import Axios from "axios";
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

    const handleClick = () => {
        Axios.delete("/api/sessions")
        .then(() => {
            createToast("로그아웃!", "이용해주셔서 감사합니다.", "success");
            router.replace("/");
            props.onLogout();
        });
    }

    const navList = [
        <NavItem key='distributor' text={"영화제 배급사"} url={"/distributor"} />,
        <NavItem key='recommend' text={"추천 영화"} url={"/movies/recommend"} />,
        <NavItem key='upload' text={"예고편 업로드"} url={"/movies/upload"} />,
        <NavItem key='mypage' text={"내 동영상"} url={"/mypage"} />
    ]
    const guestList = [
        <NavItem key='sign-in' text={"로그인"} url={"/sign-in"} />,
        <NavItem key='sign-up' text={"회원가입"} url={"/sign-up"} />
    ]
    const userList = [
        <div key='logout' className="nav-item" onClick={handleClick}>
            <a>로그아웃</a>
        </div>
    ]

    let authList = props.user ? userList : guestList;
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
export default Header;