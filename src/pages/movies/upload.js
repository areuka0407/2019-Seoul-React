import Visual from '../../components/Visual';
import UploadForm from '../../components/movies/upload/UploadForm';
import {createToast} from '../../../helper';
import {useRouter} from 'next/router';
import { useEffect } from 'react';

export default function Upload(props){
    const router = useRouter();
    const user = props.user;

    useEffect(() => {
        if(!user) {
            createToast("로그인이 필요합니다!", "이 페이지는 로그인을 필요로 합니다! 로그인 후 다시 시도하여 주시기 바랍니다.")
            router.replace("/sign-in");
            return <></>;
        }
    }, [])
    

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