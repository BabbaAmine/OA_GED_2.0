import React from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import oalogo from "../../assets/logo/oa_logo_2.png"
import "./login.css"
import "./backgroundAnim.css"
import {Button as MuiButton, TextField} from "@mui/material";
import extern_sso_service from "../../provider/extern_sso_service";
import jwt_decode from "jwt-decode";
import LoginIcon from '@mui/icons-material/Login';
import Loader from '../../components/Loaders/Loader';
import projectFunctions from "../../tools/project_functions";

const popup_w = 900;
const popup_h = 700;

var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top;

var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;

var left = ((width / 2) - (popup_w / 2)) + dualScreenLeft;
var top = ((height / 2) - (popup_h / 2)) + dualScreenTop;


export default function Login(props){

    const screenSize = useWindowSize()
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false);


    const conn = () => {

        setLoading(true)
        setTimeout(() => {
            extern_sso_service.sso().then( res => {
                console.log(res)
                if(res.status === 200 && res.succes === true){
                    var newWindow = window.open(res.data.url, "Login", 'scrollbars=yes, width=' + popup_w + ', height=' + popup_h + ', top=' + top + ', left=' + left);
                    if (window && window.focus) {
                        newWindow.focus();
                    }
                    extern_sso_service.conn(res.data.id).then( connRes => {
                        console.log(connRes)
                        if(connRes && connRes.data){
                            var decoded = jwt_decode(connRes.data.usrtoken);
                            console.log(decoded)
                            localStorage.setItem("usrtoken",connRes.data.usrtoken)
                            setTimeout(async () => {
                                localStorage.setItem("username",(decoded.payload.last_name || "") + " " + (decoded.payload.first_name || ""))
                                let find_oa_user = await projectFunctions.find_oa_user({email:decoded.payload.email},"",1,1)
                                if(find_oa_user && find_oa_user !== "false" && find_oa_user.image && find_oa_user.image !== ""){
                                    localStorage.setItem("username",(decoded.payload.last_name || "") + " " + (decoded.payload.first_name || ""))
                                    localStorage.setItem("image",find_oa_user.image)
                                }
                                localStorage.setItem("exp",decoded.exp)
                                localStorage.setItem("email",decoded.payload.email)
                                localStorage.setItem("id",decoded.payload.id)
                                setLoading(false)
                                newWindow.close()
                                navigate("/home/timesheets/list",{replace:true})
                            },500)

                        }else{
                        }
                    }).catch(err => {console.log(err)})
                }else{
                    console.log(res.error)
                }
            }).catch( err => {
                console.log(err)
            })
        },500)
    }


    return(
        <div>
            <div className="account-container">
                <a href="https://oalegal.ch" className="left-logo">
                    <img src={oalogo} alt=""/>
                </a>
                <div className="left-text-container">
                    <h2>Clients, TimeSheet et Facturation</h2>
                    <p>Espace numérique de gestion des timesheets et facturation.</p>
                </div>
                <div className="left-bottom-container">
                    <p>© 2020-2023 Rocket Bonds Co., Ltd. Tous droits réservés.</p>
                </div>
                <div className="right-container right-loaded" style={{top: 0, marginTop: 147,borderRadius:10,zIndex:100}}>
                    <div className="sign-list" id="sign-in" style={{display:"block"}}>
                        <h1>Connectez-vous à votre ENT</h1>
                        <div className="input-list" style={{marginTop:60}}>
                            <div className="input-list-con first-init" style={{display:"block"}}>
                                <div align="center" style={{marginTop:30}}>
                                    <MuiButton variant="contained" color="primary" size="large"
                                               style={{textTransform: "none", fontWeight: 800,height:46,fontSize:"1.1rem"}}
                                               endIcon={<LoginIcon style={{color: "#fff"}}/>}
                                               onClick={() => {
                                                   conn()
                                               }}
                                               fullWidth={true}
                                    >
                                        Se connecter
                                    </MuiButton>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {loading && <Loader/>}
            </div>

            <div className="area">
                <ul className="circles">
                    {
                        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((item, key) => (
                            <li key={key}/>
                        ))
                    }
                </ul>
            </div>

        </div>
    )

}