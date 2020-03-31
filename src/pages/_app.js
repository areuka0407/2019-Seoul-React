import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {toast, ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../../public/fontawesome/css/fontawesome.css';
import '../../public/fontawesome/js/all.js'
import '../../public/bootstrap-4.4.1-dist/css/bootstrap.css';
import '../../public/css/style.css';
import { createToast } from '../../helper';



export default class MyApp extends App {
    constructor(props){
        super(props);

        this.state = {
            user: null,
        }
    }

    // 현재 URL을 기반으로 /pages 디렉토리에서 가져온 컴포넌트가 'Components'에 담겨 있다. 
    static async getInitialProps({Component, ctx}){
        // 만약 컴포넌트 내에 'getInitialProps' 설정이 있다면 이를 실행해 _app.js 의 props으로 받는다
        let pageProps = {};
        if(Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);

        // session 내에 passport 가 존재하면 이를 pageProps에 담는다.
        let user = null;
        if(ctx.req && ctx.req.session.user){
            user = ctx.req.session.user;
        }

        // session 내에 message가 존재하면 이를 토스트 메세지로 띄워준다
        let message = null;
        if(ctx.req && ctx.req.session.message){
            message = ctx.req.session.message;
            delete ctx.req.session.message;
        }

        return {
            user,
            pageProps,
            message
        }
    }

    componentDidMount(){
        const {message}= this.props;

        if(message){
            createToast(message.title, message.message);
        }
        this.setState({user: this.props.user});
    }

    handleLogin = (user) => {
        this.setState({user});
    }

    handleLogout = () => {
        console.log(this);
        this.setState({user: null})
    }

    render(){
        const {Component, pageProps} = this.props;
        const user = this.state.user || this.props.user;
        if(Component.name === "Signin") pageProps.onLogin = this.handleLogin;
    

        return (
            <>
                <Head>
                    <title>부산국제영화제</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Header user={user} onLogout={this.handleLogout} />
                <div id="wrapper">
                    <Component user={user} {...pageProps} />
                    <Footer />
                </div>
                <ToastContainer enableMultiContainer position={toast.POSITION.TOP_LEFT} />
            </>
        )
    }
}