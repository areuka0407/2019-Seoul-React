import Visual from '../../components/Visual';
import Player from '../../components/movies/info/Player';
import CommentArea from '../../components/movies/info/Comment';
import Userinfo from '../../components/movies/info/Userinfo';
import Movieinfo from '../../components/movies/info/Movieinfo';



function Movie(props){
    const {video} = props;

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
                        <Userinfo userdata={video.user} />
                    </div>
                    <div className="px-3">
                        <Player video={video} />
                    </div>
                    <div className="px-3 mt-5">
                        <Movieinfo moviedata={video} />      
                    </div>
                    <hr className="mx-3 my-4" />
                    <div className="px-3 mt-4">
                        <CommentArea list={video.comments} />
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
    
    return {video}
}

export default Movie