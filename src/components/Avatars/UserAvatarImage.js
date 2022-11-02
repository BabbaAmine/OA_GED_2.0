import React,{useEffect} from "react";
import {ShimmerCircularImage,ShimmerTitle} from "react-shimmer-effects";
import Avatar from "@mui/material/Avatar";
import ApiBackService from "../../provider/ApiBackService";


export default function RenderUserAvatarImage(props){
    const [user, setUser] = React.useState();
    useEffect(() => {
        if(!user){
            ApiBackService.get_user_details(props.user_id).then( res => {
                if(res.status === 200 && res.succes === true){
                    setUser(res.data)
                }
            }).catch( err => {
               console.log(err)
            })
        }
    }, [])
    return (
        !user ?
            <ShimmerCircularImage size={props.size} />
            :
            <img className="rounded-circle text-center"
                 style={{width: props.size, height: props.size, objectFit: "contain",border:"2px solid #F0F0F0"}}
                 src={user.image}
                 title={user.last_name + " " + user.first_name}
                 alt=""/>
            /*<Avatar alt="" src={user.image}
                    title={user.last_name + " " + user.first_name}
                    sx={{ width: props.size, height: props.size }}
                    style={{objectFit:"contain",border:"2px solid #F0F0F0", borderRadius: "50%"}}
                    variant="rounded"
            />*/

    )
}