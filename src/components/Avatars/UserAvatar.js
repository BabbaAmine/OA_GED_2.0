import React,{useEffect} from "react";
import rethinkFunctions from "../../tools/rethink_functions";
import {ShimmerText,ShimmerCircularImage} from "react-shimmer-effects";
import Avatar, {AvatarItem} from "@atlaskit/avatar";
import userImg from "../../assets/images/user-96.png";


export default function RenderUserAvatar(props){
    const [user, setUser] = React.useState();
    useEffect(() => {
        !user && rethinkFunctions.getUserProfileByEmail(props.email).then(res => {
            setUser(res)
        })
    }, [user])
    return (
        !user ?
            <ShimmerText line={1}/>
             :
            <div title={user !== "false" ? user.fname : props.email} style={{cursor:"pointer"}}>
                <AvatarItem
                    avatar={<Avatar size="small" src={(user !== "false" && user.photo !== "") ? user.photo : userImg}/>}
                    primaryText={user !== "false" ? user.fname : props.email}
                />
            </div>

    )
}