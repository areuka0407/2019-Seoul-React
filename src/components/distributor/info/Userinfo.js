export default function Userinfo(props){
    const {userdata} = props;

    return (
        <div className="d-flex align-items-center">
            <img src={"/images/profiles/" + userdata.img} alt="프로필 이미지"/>
            <div className="w-100 ml-4">
                <div className="fx-2 font-weight-bold">{userdata.name}</div>
                <div className="fx-n2 mt-1 text-muted">팔로워: {userdata.follower.length.toLocaleString()}</div>
                <button className="underline-btn mt-3 fx-n2">팔로우</button>
            </div>
            <style jsx>{`
                img {
                    overflow: hidden;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    flex: 0 0 100px;
                    width: 100px;
                    height: 100px;
                    padding: 10px;
                    object-fit: contain;
                }
            `}</style>
        </div>
    )
}
