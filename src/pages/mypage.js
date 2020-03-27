import React, {useState} from 'react';
import Link from 'next/link';
import Visual from '../components/Visual';
import {videos, users} from '../../public/json/data.json';
import '../../helper';
import Userinfo from '../components/mypage/Userinfo';
import Videolist from '../components/mypage/Videolist';





export default function Mypage() {
    const [user, setUser] = useState(users[0]);
    const videoList = videos.filter(video => video.users_id == user.idx);

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