import {useRouter} from 'next/router';

export default function Movieinfo(props){
    const router = useRouter();
    const {moviedata} = props;
    const created_at = new Date(moviedata.date);

    let viewCount = moviedata.view.reduce((prev, cur) => prev + cur.count, 0);

    return (
        <div className="w-100 py-3 d-flex justify-content-between align-items-end">
            <div className="d-flex">
                <img src={"/images/thumbnails/" + moviedata.thumbnail} alt="섬네일 이미지"/>
                <div className="px-4">
                    <div className="fx-2">{moviedata.title}</div>
                    <div className="fx-n2 text-muted mt-2">
                        <div className="mt-1">
                            <span>출품일</span>
                            <span className="ml-2">{created_at.toLocaleDateString()}</span>
                        </div>
                        <div className="mt-1">
                            <span>조회수</span>
                            <span className="ml-2">{viewCount.toLocaleString()}</span>
                        </div>
                        <div className="mt-1">
                            <span>영상 길이</span>
                            <span className="ml-2">{moviedata.duration}분</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="underline-btn fx-n2" onClick={() => router.replace('/movies/[id].js', '/movies/' + moviedata.idx)}>상세보기</button>
            <style jsx>{`
                img {
                    width: 200px;
                }
            `}</style>
        </div>
    )
}
