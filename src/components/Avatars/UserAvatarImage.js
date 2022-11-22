import React from "react";
import {ShimmerCircularImage} from "react-shimmer-effects";


export default function RenderUserAvatarImage(props){

    return (
        <img className="rounded-circle text-center"
             style={{width: props.size, height: props.size, objectFit: "contain",border:"2px solid #F0F0F0"}}
             src={props.image}
             title={props.last_name + " " + props.first_name}
             alt=""/>
    )
}