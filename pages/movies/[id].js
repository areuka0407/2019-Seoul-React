import {videos, users} from '../../public/json/data.json';
import {useRouter} from 'next/router';
import Visual from '../../components/Visual';
import Player from '../../components/movies/info/Player';
import CommentArea from '../../components/movies/info/Comment';
import Userinfo from '../../components/movies/info/Userinfo';
import Movieinfo from '../../components/movies/info/Movieinfo';
import '../../helper';



export default function Movie(){
    const router = useRouter();
    const video = router.query.id ? videos.find(video => video.idx == router.query.id) : videos[0];
    const user = users.find(user => user.idx == video.users_id);

    return (
        <div>
            <Visual 
                mainTitle="Movie Information" 
                subTitle="영화 정보" 
                src="/images/more_img_4.jpg" 
            />
            <div className="container padding">
                <div>
                    <div className="px-3 mb-5">
                        <Userinfo userdata={user} />
                    </div>
                    <div className="px-3">
                        <Player video={video} />
                    </div>
                    <div className="px-3 mt-5">
                        <Movieinfo moviedata={video} />      
                    </div>
                    <hr className="mx-3 my-4" />
                    <div className="px-3 mt-4">
                        <CommentArea moviedata={video} />
                    </div>
                </div>
            </div>
        </div>
    )
}