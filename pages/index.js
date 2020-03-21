import React from "react";
import {videos} from "../public/json/data.json";
import Movieinfo from "../components/index/Movieinfo";
import Visual from "../components/index/Visual";

export default class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = { video: videos[0] };
    }

    componentDidMount(){
        this.setState({
            video: videos[ parseInt(Math.random() * videos.length - 1) ]
        });
    }

    render(){
        const video = this.state.video;

        return (
            <div>
                <Visual />
                <Movieinfo video={video} />
            </div>
        )   
    }
}