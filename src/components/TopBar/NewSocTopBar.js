import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import smartco_logo from "../../assets/logos/smartco_logo_2.png"

export default function NewSocietyTopBar(props) {



    return(
        <AppBar position="relative" style={{backgroundColor:"#f5f7fb"}} elevation={0}>
            <Toolbar style={{height:props.height,minHeight:props.height}}>
                <img alt="" src={smartco_logo} style={{height:40,width:85,objectFit:"cover"}}/>
            </Toolbar>
        </AppBar>

    )
}
