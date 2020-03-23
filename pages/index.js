import React from "react";
import MovieList from "../components/index/MovieList";
import Visual from "../components/index/Visual";

export default class Index extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <Visual />
                <MovieList />
            </div>
        )   
    }
}