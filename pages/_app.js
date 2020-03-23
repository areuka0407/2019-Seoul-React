import App from 'next/app';
import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import '../public/css/style.css';
import '../public/bootstrap-4.4.1-dist/css/bootstrap.css';


export default class MyApp extends App {
    constructor(props){
        super(props);
    }

    render(){
        const {Component, pageProps} = this.props;

        return (
            <div>
                <Header />
                <div id="wrapper">
                    <Component {...pageProps} />
                    <Footer />
                </div>
            </div>
        )
    }
}