import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {toast, ToastContainer} from 'react-toastify';
import Axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import '../public/fontawesome/css/fontawesome.css';
import '../public/fontawesome/js/all.js'
import '../public/bootstrap-4.4.1-dist/css/bootstrap.css';
import '../public/css/style.css';


export default class MyApp extends App {
    constructor(props){
        super(props);
    }

    // 현재 URL을 기반으로 /pages 디렉토리에서 가져온 컴포넌트가 'Components'에 담겨 있다. 
    static async getInitialProps({Component, ctx}){

        // 만약 컴포넌트 내에 'getInitialProps' 설정이 있다면 이를 실행해 _app.js 의 props으로 받는다
        let pageProps = {};
        if(Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
        return {
            pageProps
        }
    }

    render(){
        const {Component, pageProps} = this.props;

        return (
            <>
                <Head>
                    <title>부산국제영화제</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Heade />
                <div id="wrapper">
                    <Component {...pageProps} />
                    <Footer />
                </div>
                <ToastContainer enableMultiContainer containerId={'left'} position={toast.POSITION.TOP_LEFT} />
                <ToastContainer enableMultiContainer containerId={'center'} position={toast.POSITION.BOTTOM_CENTER} />
                <ToastContainer enableMultiContainer containerId={'right'} position={toast.POSITION.TOP_RIGHT} />
            </>
        )
    }
}