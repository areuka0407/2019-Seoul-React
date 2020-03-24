import Visual from '../../components/Visual';
import UploadForm from '../../components/movies/upload/UploadForm';

export default function Upload(){
    return (
        <>
            <Visual 
                mainTitle="Upload Teaser Trailer" 
                subTitle="예고편 업로드"
                src="/images/more_img_3.jpg"
            />
            <div className="container padding">
                <div className="text-center">
                    <h5 className="fx-5">
                        <span className="font-weight-bolder">UPLOAD</span>
                        <span className="ml-2">FORM</span>
                    </h5>
                    <p className="mt-3 fx-n1 text-muted">출품할 영화의 예고편 영상을 업로드 하세요!</p>
                </div>               
                <hr className="my-5"/>
                <UploadForm />
            </div>
        </>
    );
}