import React,{useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import {Button as MuiButton, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function TM_List(props) {


    const screenSize = useWindowSize()
    const navigate = useNavigate()

    useEffect(() => {

    }, [])

    const [loading, setLoading] = React.useState(false);


    return(
        <div>
            <MuiBackdrop open={loading} text={"Chargement..."}/>
            <div className="container container-lg"
                 style={{marginTop: 60, height: screenSize.height - 80, overflowX: "auto"}}>
                <div className="card">
                    <div className="card-body">
                        <div style={{display: "flex", justifyContent: "space-between"}} className="mb-3">
                            <Typography variant="h6" style={{fontWeight: 700}} color="primary">Time Sheet</Typography>
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           startIcon={<AddIcon style={{color: "#fff"}}/>}
                                           onClick={() => {
                                           }}
                                >
                                    Ajouter un timeSheet
                                </MuiButton>
                            </div>
                        </div>
                        <hr style={{color: "#EDF2F7", marginBottom: 15}}/>
                    </div>
                </div>
            </div>
        </div>
    )}