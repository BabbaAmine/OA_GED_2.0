import React,{useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import {Button as MuiButton, MenuItem, TextField, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {timeSuggestions} from "../../data/data";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Project_functions from "../../tools/project_functions";
import {toast} from "react-toastify";
import userAvatar from "../../assets/images/user_avatar3.png";
import projectFunctions from "../../tools/project_functions";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InputAdornment from "@mui/material/InputAdornment";
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TM_List(props) {


    const screenSize = useWindowSize()
    const navigate = useNavigate()


    const [loading, setLoading] = React.useState(false);
    const [tabs, setTabs] = React.useState(0);
    const [clients, setClients] = React.useState();
    const [client_folders, setClient_folders] = React.useState();
    const [oa_users, setOa_users] = React.useState();

    const [newTimeSheet, setNewTimeSheet] = React.useState({
        type:0,
        duration:"",
        desc:"",
        date:"",
        client:"",
        cl_folder:"",
        user:"",
        user_price:""
    });

    useEffect(() => {
        !clients && get_clients()
        !oa_users && get_oa_users()
    }, [])

    const get_clients = async () => {
        let clients = await Project_functions.get_clients({}, "", 1, 5000)
        if (clients && clients !== "false") {
            setClients(clients.sort((a, b) => {
                let fname1 = a.name_2 || '' + ' ' + a.name_1 || ''
                let fname2 = b.name_2 || '' + ' ' + b.name_1 || ''
                if (fname1.toLowerCase().trim() < fname2.toLowerCase().trim()) {
                    return -1;
                }
                if (fname1.toLowerCase().trim() > fname2.toLowerCase().trim()) {
                    return 1;
                }
                return 0;
            }))
        } else {
            console.error("ERROR GET LIST CLIENTS")
            setTimeout(() => {
                get_clients()
            },5000)
        }
    }

    const get_client_folders = async (client_id) => {
        let client_folders = await Project_functions.get_client_folders(client_id,{},"",1,50)
        console.log(client_folders)
        if(client_folders && client_folders !== "false"){
            setClient_folders(client_folders)
        }else{
            console.error("ERROR GET LIST CLIENTS FOLDERS")
            setTimeout(() => {
                get_client_folders()
            },5000)
        }
    }

    const get_oa_users = async () => {
        let oa_users = await Project_functions.get_oa_users({},"",1,50)
        if(oa_users && oa_users !== "false"){
            setOa_users(oa_users)
        }else{
            console.error("ERROR GET LIST USERS")
            setTimeout(() => {
                get_oa_users()
            },5000)
        }
    }


    return(
        <div>
            <MuiBackdrop open={loading} text={"Chargement..."}/>
            <div className="container container-lg"
                 style={{marginTop: 60, height: screenSize.height - 80, overflowX: "auto"}}>
                <div className="card">
                    <div className="card-body" style={{minHeight:800}}>
                        <Typography variant="h6" style={{fontWeight: 700}} color="primary">TimeSheet / Activités</Typography>
                        <hr style={{color: "#EDF2F7", marginBottom: 20}}/>
                        <div className="mt-1">
                            <Tabs value={tabs}
                                  onChange={(e,value) => {setTabs(value)}}
                                  variant="scrollable"
                                  allowScrollButtonsMobile={true}
                                  scrollButtons="auto"
                                  aria-label="basic tabs">
                                <Tab label="Créer un TimeSheet" {...a11yProps(0)}/>
                                <Tab label="Activités" {...a11yProps(1)} />
                                <Tab label="Facturation" {...a11yProps(2)} />
                                <Tab label="Report" {...a11yProps(3)} />
                                <Tab label="Work in progress" {...a11yProps(4)} />
                            </Tabs>
                            <TabPanel value={tabs} index={0}>
                                <div>
                                    <div className="mt-3">
                                        <div className="row">
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Catégorie d'activité</Typography>
                                                <TextField
                                                    select
                                                    type={"text"}
                                                    variant="outlined"
                                                    value={newTimeSheet.type}
                                                    onChange={(e) =>{
                                                        setNewTimeSheet(prevState => ({
                                                            ...prevState,
                                                            "type": e.target.value
                                                        }))
                                                    }}
                                                    style={{width: "100%"}}
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                        style: {
                                                            color: "black",
                                                            fontSize: 16
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value={0}>Temps facturé</MenuItem>
                                                    <MenuItem value={1}>Provision</MenuItem>
                                                </TextField>
                                            </div>
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Date</Typography>
                                                <TextField
                                                    type={"date"}
                                                    variant="outlined"
                                                    value={newTimeSheet.date}
                                                    onChange={(e) =>{
                                                        setNewTimeSheet(prevState => ({
                                                            ...prevState,
                                                            "date": e.target.value
                                                        }))
                                                    }}
                                                    style={{width: "100%"}}
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                        style: {
                                                            color: "black",
                                                            fontSize: 16
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-lg-12 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Durée</Typography>
                                                <Autocomplete
                                                    freeSolo={true}
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={timeSuggestions}
                                                    noOptionsText={""}
                                                    getOptionLabel={(option) => option || ""}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                                            <TimerOutlinedIcon color="primary"/>
                                                            &nbsp;&nbsp;{option}
                                                        </Box>
                                                    )}
                                                    value={timeSuggestions.find(x => x === newTimeSheet.duration) ? timeSuggestions.find(x => x === newTimeSheet.duration) : ""}
                                                    onChange={(event, value) => {
                                                        console.log(value)
                                                        setNewTimeSheet(prevState => ({
                                                            ...prevState,
                                                            "duration": value ? (value || "") : ""
                                                        }))
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={newTimeSheet.duration}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                                placeholder:"Format: --h--"
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: false,
                                                                style: {
                                                                    color: "black",
                                                                    fontSize: 16
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                            }
                                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                        </Box>
                                                    )}
                                                    value={newTimeSheet.client || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "client": value,
                                                                "cl_folder": ""
                                                            }))
                                                            get_client_folders(value.id)
                                                        }else{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "client": "",
                                                                "cl_folder":""
                                                            }))
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={newTimeSheet.client || ""}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: false,
                                                                style: {
                                                                    color: "black",
                                                                    fontSize: 16
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Dossier</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={client_folders || []}
                                                    noOptionsText={"Aucun dossier trouvé"}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    loading={newTimeSheet.client !== "" && !client_folders}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                <FolderOpenOutlinedIcon color={"primary"}/>
                                                            }
                                                            &nbsp;&nbsp;{option.name || ""}
                                                        </Box>
                                                    )}
                                                    value={newTimeSheet.cl_folder || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "cl_folder": value
                                                            }))
                                                        }else{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "cl_folder": ""
                                                            }))
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={newTimeSheet.cl_folder || ""}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: false,
                                                                style: {
                                                                    color: "black",
                                                                    fontSize: 16
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-lg-12 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Description</Typography>
                                                <TextField
                                                    type={"text"}
                                                    multiline={true}
                                                    rows={4}
                                                    variant="outlined"
                                                    value={newTimeSheet.desc}
                                                    onChange={(e) =>{
                                                        setNewTimeSheet(prevState => ({
                                                            ...prevState,
                                                            "desc": e.target.value
                                                        }))
                                                    }}
                                                    style={{width: "100%"}}
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                        style: {
                                                            color: "black",
                                                            fontSize: 16
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Utilisateur</Typography>
                                                <Autocomplete
                                                    style={{width:"100%"}}
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={oa_users || []}
                                                    noOptionsText={""}
                                                    getOptionLabel={(option) => (option.last_name || "") + (option.first_name ? (" " + option.first_name) : "")}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            <img
                                                                loading="lazy"
                                                                width="30"
                                                                src={option.image || userAvatar}
                                                                srcSet={option.image || userAvatar}
                                                                alt=""
                                                            />
                                                            {option.last_name} ({option.first_name})
                                                        </Box>
                                                    )}
                                                    value={newTimeSheet.user || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "user": value.id,
                                                                "user_price":value.price || ""
                                                            }))
                                                        }else{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "user": "",
                                                                "user_price":""
                                                            }))
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={newTimeSheet.user || ""}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: false,
                                                                style: {
                                                                    color: "black",
                                                                    fontSize: 16
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Taux horaire</Typography>
                                                <TextField
                                                    style={{width:"100%"}}
                                                    type={"text"}
                                                    variant="outlined"
                                                    inputMode="tel"
                                                    value={newTimeSheet.user_price}
                                                    onChange={(e) => {
                                                        setNewTimeSheet(prevState => ({
                                                            ...prevState,
                                                            "user_price":e.target.value
                                                        }))
                                                    }}
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                        style: {
                                                            color: "black",
                                                            fontSize: 16
                                                        }
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">CHF/h</InputAdornment>,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div style={{display:"flex",justifyContent:"center"}}>
                                            <div>
                                                <MuiButton variant="contained" color="primary" size="medium"
                                                           style={{textTransform: "none", fontWeight: 800}}
                                                           startIcon={<AddIcon color="white"/>}
                                                           onClick={() => {
                                                           }}
                                                >
                                                    Ajouter
                                                </MuiButton>
                                            </div>
                                            <div>
                                                <MuiButton variant="contained" color="primary" size="medium"
                                                           style={{textTransform: "none", fontWeight: 800,marginLeft:15}}
                                                           startIcon={<LibraryAddOutlinedIcon color="white"/>}
                                                           onClick={() => {

                                                           }}
                                                >
                                                    Ajouter & dupliquer
                                                </MuiButton>
                                            </div>
                                            <div>
                                                <MuiButton variant="outlined" color="primary" size="medium"
                                                           style={{textTransform: "none", fontWeight: 800,marginLeft:15}}
                                                           startIcon={<ClearAllOutlinedIcon color="primary"/>}
                                                           onClick={() => {
                                                           }}
                                                >
                                                    Réinitialiser
                                                </MuiButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={tabs} index={1}>

                            </TabPanel>
                            <TabPanel value={tabs} index={2}>

                            </TabPanel>
                            <TabPanel value={tabs} index={3}>

                            </TabPanel>
                            <TabPanel value={tabs} index={4}>

                            </TabPanel>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )}