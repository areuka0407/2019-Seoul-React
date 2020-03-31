import React, {useEffect} from 'react';
import Visual from '../components/Visual';
import Userinfo from '../components/mypage/Userinfo';
import Videolist from '../components/mypage/Videolist';
import Axios from 'axios';

import {createToast} from '../../helper';
import Router from 'next/router';


function Mypage(props) {
    let {user, videoList} = props;

    if(!user) {
        createToast("로그인이 필요합니다!", "이 페이지는 로그인을 필요로 합니다! 로그인 후 다시 시도하여 주시기 바랍니다.")
        Router.replace("/sign-in");
        return <></>;
    }


    return (
        <div>
            <Visual mainTitle="Movies Management" subTitle="내 동영상 관리" src="/images/more_img_4.jpg" />
            <div className="container padding">
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        <Userinfo userdata={user} />
                    </div>
                    <div className="col-sm-12 col-md-8 mt-5 mt-md-0">
                        <Videolist list={videoList} />
                    </div>
                </div>
            </div>
        </div>
    )
}

Mypage.getInitialProps = async function(ctx){
    let videoReq;
    if(ctx.req){
        let user = ctx.req.session.user;
        videoReq = await Axios.get("/api/videos?user=" + user.idx);
    }
    else {
        videoReq = await Axios.get("/api/videos?only-mine=true");
    }

    return {
        videoList: videoReq.data.videoList
    }
}


export default Mypage;