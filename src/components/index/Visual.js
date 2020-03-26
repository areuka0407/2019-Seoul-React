import React from "react";

function Button(props){
    const buttonStyles = {
        position: "absolute",
        top: "50%",
        left: props.step < 0 ? "0" : "calc(100% - 80px)",
        transform: "translateY(-50%)" + (props.step < 0 ? "" : " rotate(180deg)"),
        width: "80px",
        height: "80px",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        zIndex: 20,
    }   
    const imageStyles ={
        objectFit: "contain",
        width: "100%",
        height: "100%",
    }

    return (
        <button style={buttonStyles} onClick={props.onClick}>
            <img style={imageStyles} src="/images/slide-btn.png" />
        </button>
    )
}
function Circle(props){
    const styles = {
        display: "inline-block",
        width: "10px",
        height: "10px",
        border: "1px solid #fff",
        borderRadius: "50%",
        backgroundColor: props.active ? "#fff" : "transparent",
        transition: "background-color 2s",
        cursor: "pointer",
    }

    return (
        <div style={styles} onClick={props.onClick}></div>
    )
}
function Image(props){
    return (
        <div className="slide-image">
            <div className="texts">
                <div className="text-center">
                    <div className="main d-lg-inline-flex flex-column flex-lg-row align-items-center">
                        <span className="fx-9 fx-lg-6 font-weight-bold">{props.text1}</span>
                        <span className="d-lg-flex fx-lg-6 font flex-lg-column align-items-start ml-3">
                            <span>{props.text2} </span>
                            <span>{props.text3} </span>
                        </span>
                    </div>
                    <div className="sub mt-3">
                        <p>{props.description}</p>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .slide-image,
                .slide-image::before {
                    position: absolute;
                    left: 0; top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: ${props.alpha};
                    transition: opacity 2s;
                }

                .slide-image::before {
                    content: '';
                    background-color: rgb(27, 43, 82);
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-blend-mode: lighten;
                    background-image: url(/images/slides/${props.id + 1}.jpg);
                    filter: brightness(60%) grayscale(30%);
                }

                .texts {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    color: #fff;
                    text-shadow: 0 1px 6px #000a;
                    max-width: 992px;
                    width: 100%;
                    padding: 0 24px;
                }

                .texts .main {
                    position: relative;
                    text-transform: uppercase;
                    font-size: 25px;
                }

                .texts .sub {
                    margin-top: 1.5em;
                    position: relative;
                    font-weight: 600;
                    word-break: keep-all;
                }

                @media(max-widtH: 992px){
                    .texts {
                        border: none;
                    }

                    .texts .sub {
                        font-size: 1em;
                    }
                }
            `}</style>
        </div>
    )
}

export default class Visual extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            slideList: [
                {
                    text1: "Create", text2: "Various", text3: "Contents", 
                    description: "2019년 부산국제영화제를 함께 만들어갈 여러분을 기다립니다.",
                    alpha: 1,
                },
                {
                    text1: "Challenge", text2: "Makes", text3: "New Movie", 
                    description: "최상의 콘텐츠를 세상에 선보이기 위해 끊임없이 새로운 도전을 합니다.",
                    alpha: 0,
                },
                {
                    text1: "Going", text2: "Global", text3: "and Beyond", 
                    description: "전 세계 누구나 공감할 수 있는 영화로 글로벌 소통합니다.",
                    alpha: 0,
                }
            ],
            nowSlide: 0,
        };
    }

    componentDidMount(){
        this.slideTimer = setInterval(() => this.slideProcess(), 6000);
    }

    componentWillUnmount(){
        clearInterval(this.slideTimer);
    }

    setSlide(idx){
        const nowSlide = this.state.nowSlide;
        const slideList = JSON.parse(JSON.stringify(this.state.slideList));
        slideList[nowSlide].alpha = 0;
        slideList[idx].alpha = 1;
        
        this.setState({nowSlide: idx, slideList});
        clearInterval(this.slideTimer);
        this.slideTimer = setInterval(() => this.slideProcess(), 6000);
    }

    slideProcess(){
        const slideList = JSON.parse(JSON.stringify(this.state.slideList));
        let nowSlide = this.state.nowSlide;

        slideList[nowSlide].alpha = 0;
        nowSlide = nowSlide + 1 >= slideList.length ? 0 : nowSlide + 1;
        slideList[nowSlide].alpha = 1;
        
        this.setState({nowSlide, slideList});
    }

    render(){
        const {slideList, nowSlide} = this.state;
        const toolCount = slideList.length;
        return (
            <div className="visual">
                <div className="images">
                    {slideList.map((info, idx) => <Image id={idx} key={idx} alpha={info.alpha} text1={info.text1} text2={info.text2} text3={info.text3} description={info.description} />)}
                </div>
                <div className="tools">
                    {slideList.map((info, idx) => <Circle id={idx} key={idx} active={idx === nowSlide} onClick={() => this.setSlide(idx)} /> )}
                </div>
                <Button onClick={() => this.setSlide(nowSlide - 1 < 0 ? slideList.length - 1 : nowSlide - 1) } step={-1} />
                <Button onClick={() => this.setSlide(nowSlide + 1 >= slideList.length ? 0 : nowSlide + 1) } step={1} />
                <style jsx>{`
                    .visual {
                        position: relative;
                        height: 600px;
                        overflow: hidden;
                    }
    
                    .visual .images {
                        position: absolute;
                        left: 0; top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #000;
                    }

                    .tools {
                        position: absolute;
                        left: 50%;
                        bottom: 10%;
                        transform: translateX(-50%);
                        width: calc(10px * ${toolCount} + 8px * ${toolCount - 1});
                        display: flex;
                        justify-content: space-between;
                    }
                `}</style>
            </div>
        )
    }
}
