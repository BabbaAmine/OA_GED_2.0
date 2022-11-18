import React,{useEffect} from "react";
import {ShimmerCircularImage,ShimmerTitle} from "react-shimmer-effects";
import ApiBackService from "../../provider/ApiBackService";
import userAvatar from "../../assets/images/default_avatar.png"
import {motion} from "framer-motion";


export default function RenderAsyncUserAvatar(props){
    const [user, setUser] = React.useState();
    useEffect(() => {
        if(!user){
            ApiBackService.get_user_details(props.user_id).then( res => {
                if(res.status === 200 && res.succes === true){
                    setUser(res.data)
                }
            }).catch( err => {

            })
        }
    }, [])
    return (
        !user ?
            <div style={{display:"flex"}}>
                <div style={{alignSelf:"center"}}>
                    <ShimmerCircularImage size={35} />
                </div>
                <div style={{marginLeft:10,width:110,alignSelf:"center"}}>
                    <ShimmerTitle line={1} gap={10} variant="secondary" />
                </div>

            </div>
             :
            <motion.div
                className="box"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
            >
            <div style={{display:"flex",justifyContent:"flex-start"}}>
                        <img className="rounded-circle text-center"
                             style={{width: "2.2rem", height: "2.2rem", objectFit: "contain",alignSelf:"center"}}
                             src={user.image && user.image !== "" ? user.image : userAvatar}
                             alt=""/>
                <span style={{ verticalAlign: 'middle',marginLeft:"0.2rem",color:"#000",fontWeight:600,alignSelf:"center" }}>
                    {user.last_name + " " + user.first_name }
                </span>
            </div>
            </motion.div>

    )
}