import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {toast, ToastContainer} from 'react-toastify';
import DB from '../src/DB';

import 'react-toastify/dist/ReactToastify.css';
import '../public/fontawesome/css/fontawesome.css';
import '../public/fontawesome/js/all.js'
import '../public/bootstrap-4.4.1-dist/css/bootstrap.css';
import '../public/css/style.css';


export default class MyApp extends App {
    constructor(props){
        super(props);
    }

    static async getInitialProps({Component, ctx}){
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
                    <meta name="viewport" content="initial-scale=1.0, width=divice-width" />
                </Head>
                <Header />
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