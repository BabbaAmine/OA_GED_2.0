import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import React, {useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export default function SignTopBar(props) {

    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
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
        <AppBar position="fixed" color="default" className="fe-ai" >
            <Toolbar style={{height:props.height}}>
                {
                    (!props.hideBackBtn || props.hideBackBtn === false) &&
                    <IconButton edge="start" aria-label="menu" onClick={() => props.onBackBtnClick()}>
                        <ArrowBackIcon style={{fontSize:26}} />
                    </IconButton>
                }
                {
                    (!props.hideSignBtn || props.hideSignBtn === false) &&
                    <div style={{cursor: "pointer", marginLeft: 30, display: "flex"}} onClick={handleToggle}
                         ref={anchorRef}
                         aria-controls={open ? 'menu-list-grow' : undefined}
                         aria-haspopup="true">
                        <img alt="" src={require('../../assets/images/autographe-30.png')}/>
                        <h5 style={{color: "#1ABC9C", marginLeft: 5}}>Placer la signature</h5>
                    </div>
                }

                <h5 style={{position:"absolute",right:25}} >{props.title}</h5>
            </Toolbar>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper style={{width:240}}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" style={{marginTop:5,maxHeight:400,overflowY:"auto"}}
                                          PaperProps={{
                                              style: {
                                                  maxHeight: 200
                                              },
                                          }}
                                >
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null)
                                        props.showSignModal()
                                    }}>
                                        <ListItemIcon>
                                            <AddCircleOutlineIcon fontSize="large"/>
                                        </ListItemIcon>
                                        <Typography variant="inherit">Créer une signature</Typography>
                                    </MenuItem>
                                    {
                                        props.savedSignatures.map((item,key) =>
                                            <MenuItem key={key} onClick={() => {
                                                setAnchorEl(null)
                                                setOpen(false)
                                                props.onClickSignature(item)
                                            }}>
                                                <img alt="" src={"data:image/png;base64," + item.b64} style={{width:140,height:45,objectFit:"contain"}}/>
                                                <IconButton style={{marginLeft:23}} onClick={(e) => {
                                                    e.stopPropagation()
                                                    props.onClickDelete(item.id)
                                                }}>
                                                    <DeleteOutlineIcon fontSize="small" color="secondary"/>
                                                </IconButton>
                                            </MenuItem>
                                        )
                                    }
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </AppBar>

    )
}