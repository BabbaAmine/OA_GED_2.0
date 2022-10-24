import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



export default function MuiBackdrop(props) {

    return (
        <div>
            <Backdrop open={props.open}
                      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
                {
                    props.text && props.text !== "" &&
                        <div style={{marginLeft:15}}>
                            {
                                props.percent && props.percent !== "" &&
                                <h5 style={{color:"#fff"}}>{props.percent + " %"}</h5>
                            }
                            <h5 style={{color:"#fff"}}>{props.text}</h5>
                        </div>

                }
            </Backdrop>
        </div>
    );
}
