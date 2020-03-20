import App from 'next/app';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../public/css/style.css';
import '../public/bootstrap-4.4.1-dist/css/bootstrap.css';


export default class MyApp extends App {
    constructor(props){
        super(props);
    }

    static async getInitialProps({ Component, router, ctx }){
        let pageProps = {};

        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx);
        }

        return { pageProps };
    }

    render(){
        const {Component, pageProps} = this.props;

        return (
            <div>
                <Header />
                <div id="wrapper">
                    <Component {...pageProps} />
                </div>
                <Footer />
            </div>
        )
    }
}