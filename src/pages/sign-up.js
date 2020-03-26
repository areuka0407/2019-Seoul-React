import Link from 'next/link';
import UserForm from '../components/sign-up/UserForm';

export default function Signup(){    
    return (
        <div className="row full-height overflow-hidden mx-0">
            <div className="left col-lg-6 d-lg-flex d-none">
                <div className="text-white text-center" style={{width: 400}}>
                    <div className="font-weight-bolder fx-5">이미 계정이 있으신가요?</div>
                    <div className="fx-n2 mt-3">부산국제영화제의 모든 콘텐츠를 바로 즐기실 수 있습니다!</div>
                    <Link href="/sign-in">
                        <button className="d-inline-block border-btn mt-5 px-5 py-2" style={{borderColor: "#fff"}}>바로가기</button>
                    </Link>
                </div> 
            </div>
            <div className="right col-lg-6 col-sm-12">
                <div className="padding-lg full-height-lg" style={{width: 480}}>     
                    <div className="text-center">
                        <div className="font-weight-bolder fx-5">회원가입</div>
                        <div className="text-muted fx-n2 mt-3">부산국제영화제에 가입해서 다양한 혜택을 누려보세요!</div>
                    </div>
                    <UserForm />
                </div>
            </div>
            <style jsx>{`
                .left {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: center;
                    padding-left: 10%;
                    padding-right: 128px;
                }

                .left::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgb(27,43,82);
                    background-blend-mode: lighten;
                    background-image: url('/images/more_img_6.jpg');
                    background-size: cover;
                    background-position: center center;
                    filter: brightness(50%);
                    z-index: -1;
                }

                .right {
                    background-color: #fff;
                    padding-left: 128px;
                    padding-right: 10%;
                    display: flex;
                    align-items: center;
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
            `}</style>
        </div>
    )
}