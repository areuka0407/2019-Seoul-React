export default function Visual(props){
    const {mainTitle, subTitle, src} = props;

    return (
        <div className="visual">
            <div className="text text-center">
                <div className="fx-6 font-weight-bold">{mainTitle}</div>
                <div className="fx-n1 mt-2 font-weight-lighter">{subTitle}</div>
            </div>
            <style jsx>{`
                .visual {
                    height: 250px;
                    color: #fff;
                    position: relative;
                }

                .visual::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    filter: brightness(50%);
                    background-image: url(${src});
                    background-color: #1b2b52;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-blend-mode: lighten;
                }

                .text {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                }
            `}</style>
        </div>
    )
}