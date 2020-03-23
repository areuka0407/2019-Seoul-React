import { Component } from 'react';
import Router from 'next/router';
import Visual from '../../components/Visual';
import {users} from '../../public/json/data.json';


export default class Info extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: users.find(user => user.idx == Router.query.id),
        }
    }

    render(){
        return (
            <div>
                <Visual mainTitle="Distributor Information" subTitle="영화 배급사 정보" src="/images/more_img_3.jpg" />
            </div>
        )
    }
}