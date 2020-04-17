import Visual from '../../components/Visual';
import Player from '../../components/movies/info/Player';
import CommentArea from '../../components/movies/info/Comment';
import Userinfo from '../../components/movies/info/Userinfo';
import Movieinfo from '../../components/movies/info/Movieinfo';
import Axios from 'axios';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {createToast} from '../../../helper';
import '../../../helper';



function Movie(props){
    const router = useRouter();
    const {video, caption, user} = props;
    
    useEffect(() => {
        if(!video){
            createToast("영화를 찾을 수 없어요...", "이 영화는 존재하지 않습니다! URL 주소를 다시 한번 확인해 주세요!");
            router.replace('/');
        }
    }, []);

    return (
        !video ?
        <></>
        :
        <div>
            <Visual 
                mainTitle="Movie Information" 
                subTitle="영화 정보" 
                src="/images/more_img_4.jpg" 
            />
            <div className="container padding">
                <div>
                    <div className="px-3 mb-5">
                        <Userinfo userdata={video.user} />
                    </div>
                    <div className="px-3">
                        <Player video={video} caption={caption} />
                    </div>
                    <div className="px-3 mt-5">
                        <Movieinfo moviedata={video} user={user} />      
                    </div>
                    <hr className="mx-3 my-4" />
                    <div className="px-3 mt-4">
                        <CommentArea vid={video.idx} list={video.comments} />
                    </div>
                </div>
            </div>
        </div>
    )
}

Movie.getInitialProps = async function(ctx){
    const Video = require('../../../models/video');
    const video = await Video.findOne({idx: ctx.query.id})
                        .populate('user')
                        .populate({
                            path: 'comments',
                            populate: {
                                path: 'user'
                            }
                        });
    
    const current = new Date();
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1, 9, 0, 0);
    const findView = video.view.find(v => v.date.getTime() == firstDay.getTime());

    if(findView) findView.count++;
    else video.view.push({date: firstDay, count: 1});
    await video.save();


    let caption = "";
    if(video && video.caption !== null){
        let req = await Axios.get("/caption/" + video.caption);
        caption = req.data;
        let list = [];
        let regex = /(?<startTime>[0-9]{2}:[0-9]{2}.[0-9]{2}) ~ (?<endTime>[0-9]{2}:[0-9]{2}.[0-9]{2})\r\n(?<text>.+)/;
        while(regex.test(caption)){
            let matches = regex.exec(caption);
            let idx = caption.indexOf(matches[0]);
            caption = caption.substr(idx + matches[0].length);
            list.push(matches.groups);
        }
        caption = list.map(item => ({startTime:  item.startTime.toTime(), endTime: item.endTime.toTime(), text: item.text}));
    }

    return {video, caption};
}

export default Movie