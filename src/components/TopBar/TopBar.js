import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import Avatar from '@mui/material/Avatar';
import utilFunctions from "../../tools/functions";
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function TopBar(props) {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };



    return(
        <AppBar position="fixed" color="default" className="fe-ai" style={{zIndex:1}} >
            <Toolbar style={{height:props.height}} onAuxClick={event => event.preventDefault()}
            >
                <IconButton edge="start" aria-label="menu" onClick={props.onClickMenuIcon}>
                    <MenuIcon style={{fontSize:26}} />
                </IconButton>
                <img alt="" src={props.logo} style={{width:55,marginLeft:10}}/>
                <div style={{position:"absolute",right:13}}>
                            <Avatar onClick={handleToggle} ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true" style={{width:40,height:40,cursor:"pointer",fontWeight:"bold",
                                backgroundColor:utilFunctions.getCharColor(localStorage.getItem("email").charAt(0))}}>
                                {localStorage.getItem("email").charAt(0).toUpperCase()}
                            </Avatar>
                </div>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper style={{width:170}}>
                                <div align="center" style={{marginTop:10}}>
                                    <Avatar  style={{fontWeight:"bold",width:45,height:45,top:15,marginBottom:15,
                                        backgroundColor:utilFunctions.getCharColor(localStorage.getItem("email").charAt(0))}}>
                                        {localStorage.getItem("email").charAt(0).toUpperCase()}
                                    </Avatar>
                                    <p style={{marginLeft:10,marginRight:10}}>{localStorage.getItem("email")+" ("+localStorage.getItem("role")+")"}</p>
                                </div>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" style={{marginTop:-15}}>
                                        <MenuItem onClick={() => {}}>Mon profil</MenuItem>
                                        <MenuItem onClick={() => {}}>Paramètres</MenuItem>
                                        <MenuItem onClick={props.onLogoutClick}>Déconnexion</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Toolbar>
        </AppBar>
    )
}