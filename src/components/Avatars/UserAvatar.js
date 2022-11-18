import React from "react";
import userAvatar from "../../assets/images/default_avatar.png"


export default function UserAvatar(props){

    return (
        <div style={{display:"flex",justifyContent:"flex-start"}}>
            <img className="rounded-circle text-center"
                 style={{width: "2.2rem", height: "2.2rem", objectFit: "contain",alignSelf:"center"}}
                 src={props.image && props.image !== "" ? props.image : userAvatar}
                 alt=""/>
            <span style={{ verticalAlign: 'middle',marginLeft:"0.2rem",color:"#000",fontWeight:600,alignSelf:"center" }}>
                    {props.last_name + " " + props.first_name }
                </span>
        </div>
    )
}