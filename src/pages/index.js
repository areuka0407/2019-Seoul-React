import React from "react";
import MovieList from "../components/index/MovieList";
import Visual from "../components/index/Visual";
import Axios from "axios";

export default class Index extends React.Component {
    constructor(props){
        super(props);
    }

    static async getInitialProps(){
        let request = await Axios("/api/videos");

        return {
            videoList: request.data.videoList
        };
    }

    render(){
        const {videoList} = this.props;

        return (
            <div>
                <Visual />
                <MovieList list={videoList} />
            </div>
        )   
    }
}