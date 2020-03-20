import Link from "next/link";

const HEIGHT = 80;

const NavArea = () => {
    return (
        <div>
            <div className="fx-n1">
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
            <style jsx>{`
                a {
                    padding: 0 15px;
                    color: #666;
                    text-decoration: none;
                }

                a:hover {
                    color: #222;
                }
            `}</style>
        </div>
    )
}



const AuthArea = () => {
    return (
        <div className="auth-area fx-n3">
            <Link href="/sign-in">
                <a>로그인</a>
            </Link>
            <Link href="/sign-in">
                <a>회원가입</a>
            </Link>
            <style jsx>{`
                a {
                    padding: 0 15px;
                    color: #666;
                    text-decoration: none;
                }

                a:hover {
                    color: #222;
                }
            `}</style>
        </div>
    )
}



const Header = () => (
    <header>
        <div className="container-fluid h-100">
            <div className="d-flex justify-content-between align-items-center h-100">
                <Link href="/">
                    <a>
                        <img src='/static/images/logo.png' height="90" />
                    </a>
                </Link>
                <NavArea />
                <AuthArea />
            </div>
        </div>
        <style jsx>{`
            header {
                height: ${HEIGHT}px;
                box-shadow: 0 1px 3px 1px #00000020;
                background-color: #222;
            }
        `}</style>
    </header>
)

export default Header;