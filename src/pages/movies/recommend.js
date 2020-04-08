import React, {useState, useEffect} from "react";
import Visual from "../../components/Visual";
import Axios from 'axios';
import {createToast} from '../../../helper';
import Router from 'next/router';
import Listitem from "../../components/movies/recommend/Listitem"


function Recommend(props){
    let {user} = props;
    const [active, setActive] = useState(null);
    const [userList, setUserList] = useState([]);

    if(!user) {
        createToast("로그인이 필요합니다!", "이 페이지는 로그인을 필요로 합니다! 로그인 후 다시 시도하여 주시기 바랍니다.")
        Router.replace("/sign-in");
        return <></>;
    }

    useEffect(() => {
        Axios.get("/api/sessions")
        .then(({data}) => {
            if(data){
                let list = data.recommends.map(rec => rec.user);
                return Promise.all(
                    list.map(user => Axios.get("/api/users?id=" + user.id))
                )
            }
        }).then(results => {
            let userList = results.map(result => result.data.user);
            setUserList(userList);
        });
    }, []);

    console.log(userList);
    return (
        <div>
            <Visual mainTitle="Recommend Movie List" subTitle="내가 추천한 영화 목록" src="/images/more_img_7.jpeg" />
            <div className="container padding">
                <div className="row align-items-start">
                    <div className="col-md-6 col-sm-12">
                        <div className="section-title px-5 py-4">
                            <div>
                                <div className="fx-3 mb-3 font-weight-bold">추천 영화 목록</div>
                                <div className="fx-n1 text-muted">내가 추천한 배급사의 영화들을 한 눈에 모아보세요!</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                        {
                            userList
                            .map((user, idx) => 
                                <Listitem 
                                    key={user.idx}
                                    active={active === user.idx}
                                    info={user}
                                    videoList={user.videos}
                                    onClick={() => setActive(user.idx)}
                                />    
                            )
                            .sort((a, b) => b.props.videoList.length - a.props.videoList.length)
                        }
                    </div>
                </div>
            </div>               
        </div>
    )
}

export default Recommend;
