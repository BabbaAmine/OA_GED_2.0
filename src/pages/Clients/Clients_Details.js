import React, {useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useLocation, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import 'react-tabs/style/react-tabs.css';
import Project_functions from "../../tools/project_functions";
import userAvatar from "../../assets/images/user_avatar2.png"
import {
    Button as MuiButton, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApiBackService from "../../provider/ApiBackService";
import {toast} from "react-toastify";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import Collapse, {Panel} from 'rc-collapse';
import {Modal} from "rsuite";
import projectFunctions from "../../tools/project_functions";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ShimmerCategoryList } from "react-shimmer-effects";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import utilFunctions from "../../tools/functions";
import {countryList} from "../../data/data";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import CloseIcon from "@mui/icons-material/Close";

export default function Clients_Details(props) {


    const screenSize = useWindowSize()
    const navigate = useNavigate()
    const location = useLocation()

    const path_array = location.pathname.split("/")
    const client_id = path_array[path_array.length-1]

    const [loading, setLoading] = React.useState(false);

    const [client, setClient] = React.useState();
    const [oa_users, setOa_users] = React.useState();
    const [client_folders, setClient_folders] = React.useState();
    const [openNewFolderModal, setOpenNewFolderModal] = React.useState(false);
    const [folder, setFolder] = React.useState({
        name:"",
        contrepartie:"",
        autrepartie:"",
        associate:[]
    });
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [toDeleteFolder, setToDeleteFolder] = React.useState();
    const [editInfos, setEditInfos] = React.useState(false);
    const [editFact, setEditFact] = React.useState(false);
    const [updateScreen, setUpdateScreen] = React.useState(false);

    useEffect(() => {
        !client && get_client(client_id)
        !oa_users && get_oa_users()
        !client_folders && get_client_folders()
    }, [])

    const get_client = (id) => {
        ApiBackService.get_client_details(id).then( res => {
            if (res.status === 200 && res.succes === true) {
                console.log(res.data)
                setClient(res.data)
            }else{

            }
        }).catch( err => {
            console.log(err)
        })
    }

    const update_client = (client) => {
        setLoading(true)
        ApiBackService.update_client(client.id,client).then( res => {
            if(res.status === 200 && res.succes === true){
                setLoading(false)
                toast.success("Modification effectuée avec succès !")
            }else{
                setLoading(false)
                toast.error(res.error)
            }
        }).catch( err => {
            setLoading(false)
            toast.error("Une erreur est survenue, veuillez recharger la page")
        })
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

    const get_client_folders = async () => {
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

    const handleChangeFolder = (name,value) => {
        setFolder(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const verif_associate = (assoc_array) => {
        if(assoc_array.length === 0) {
            return false
        }
        let test = true
        assoc_array.map( item => {
            if(item.id === "" || item.price === "" || isNaN(parseFloat(item.price)) || parseFloat(item.price) < 0){
                test = false
            }
        })
        return test
    }

    const create_folder = () => {
        setOpenNewFolderModal(false)
        setLoading(true)
        ApiBackService.create_client_folder(client_id,folder).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("La création du nouveau dossier client est effectuée avec succès !")
                setFolder({
                    name:"",
                    contrepartie:"",
                    autrepartie:"",
                    associate:[]
                })
                setClient_folders()
                get_client_folders()
                setLoading(false)
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const update_folder = (folder_id,folder) => {
        let id_array = folder_id.split("/")
        let folder_id_v2 = id_array[1]
        setLoading(true)
        ApiBackService.update_client_folder(client_id,folder_id_v2,folder).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Les modifications sur le dossier sont sauvgardées avec succès !")
                setLoading(false)
            }else{
                toast.error(res.error)
                setLoading(false)
            }
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const delete_folder = (folder_id) => {
        setOpenDeleteModal(false)
        setLoading(true)
        ApiBackService.delete_client_folder(client_id,folder_id).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("La suppression du dossier est effectué avec succès !")
                setClient_folders()
                get_client_folders()
                setLoading(false)
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    return(
        <div>
            <MuiBackdrop open={loading} text={"Chargement..."}/>
            <div className="container container-fluid" style={{marginTop: 60,height:screenSize.height-80,overflowX:"auto"}}>
                <div className="card">
                    <div className="card-body">
                        {
                            client ?
                                <div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div style={{display:"flex"}}>
                                                <Typography variant="h6" style={{fontWeight:700,alignSelf:"center"}} color="primary">
                                                    {client ? projectFunctions.get_client_title(client) : ""}
                                                </Typography>
                                                <div style={{alignSelf:"center",marginLeft:13,marginTop:8}}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={true}
                                                                onChange={() => {

                                                                }}
                                                                name="checkedActif"
                                                                color="success"
                                                            />
                                                        }
                                                        label="Actif"
                                                    />
                                                </div>
                                            </div>
                                            <hr style={{color:"#EDF2F7",marginTop:2,marginBottom:10}}/>
                                            <div>
                                                <div style={{display:"flex"}}>
                                                    <Typography variant="subtitle1" color="secondary" style={{fontWeight:600,alignSelf:"center"}}>
                                                        Informations client
                                                    </Typography>
                                                    <IconButton style={{alignSelf:"center",marginLeft:10}}
                                                                onClick={() => {
                                                                    setEditInfos(!editInfos)
                                                                }}
                                                    >
                                                        {
                                                            editInfos === true ?
                                                                <EditOffOutlinedIcon color="default"/> : <EditOutlinedIcon color="default"/>
                                                        }

                                                    </IconButton>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>
                                                            {client.type === 0  ? "Nom du client" : "Nom"}
                                                        </Typography>
                                                        {
                                                            editInfos === true ?
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="text"
                                                                    value={client.name_2}
                                                                    onChange={(e) => {
                                                                        setClient(prevState => ({
                                                                            ...prevState,
                                                                            "name_2": e.target.value
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
                                                                /> :
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                    {client.name_2}
                                                                </Typography>
                                                        }
                                                    </div>
                                                    {
                                                        client.type === 1 &&
                                                        <div className="col-md-3">
                                                            <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Prénom</Typography>
                                                            {
                                                                editInfos === true ?
                                                                    <TextField
                                                                        type={"text"}
                                                                        variant="outlined"
                                                                        inputMode="email"
                                                                        value={client.name_1}
                                                                        onChange={(e) => {
                                                                            setClient(prevState => ({
                                                                                ...prevState,
                                                                                "name_1": e.target.value
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
                                                                    /> :
                                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                        {client.name_1}
                                                                    </Typography>
                                                            }
                                                        </div>
                                                    }

                                                    <div className="col-md-4">
                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Email</Typography>
                                                        {
                                                            editInfos === true ?
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="email"
                                                                    value={client.email}
                                                                    onChange={(e) => {
                                                                        setClient(prevState => ({
                                                                            ...prevState,
                                                                            "email": e.target.value
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
                                                                /> :
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                    {client.email}
                                                                </Typography>
                                                        }
                                                    </div>
                                                    {
                                                        editInfos === true &&
                                                        <div className="col-md-2">
                                                            <MuiButton
                                                                disabled={client.name_1.trim() === "" || (client.type === 1 && client.name_2.trim() === "") || utilFunctions.verif_Email(client.email)}
                                                                onClick={() => {
                                                                    setEditInfos(false)
                                                                    update_client(client)
                                                                }}
                                                                size={"medium"}
                                                                color="primary"
                                                                variant="contained"
                                                                style={{textTransform: 'capitalize', color: "#fff", fontWeight: 700,marginTop:22}}
                                                            >
                                                                Modifier
                                                            </MuiButton>
                                                        </div>
                                                    }
                                                </div>
                                                <div style={{display:"flex"}}>
                                                    <Typography variant="subtitle1" color="secondary" style={{fontWeight:600,alignSelf:"center"}}>
                                                        Facturation
                                                    </Typography>
                                                    <IconButton style={{alignSelf:"center",marginLeft:10}}
                                                                onClick={() => {
                                                                    setEditFact(!editFact)
                                                                }}
                                                    >
                                                        {
                                                            editFact === true ?
                                                                <EditOffOutlinedIcon color="default"/> : <EditOutlinedIcon color="default"/>
                                                        }
                                                    </IconButton>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3">

                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>
                                                            Téléphone
                                                        </Typography>
                                                        {
                                                            editFact === true ?
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="email"
                                                                    value={client.phone}
                                                                    onChange={(e) => {
                                                                        setClient(prevState => ({
                                                                            ...prevState,
                                                                            "phone": e.target.value
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
                                                                /> :
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                    {client.phone === "" ? "Non défini" : client.phone}
                                                                </Typography>
                                                        }
                                                    </div>

                                                    <div className="col-md-3">
                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Langue</Typography>
                                                        {
                                                            editFact === true ?
                                                                <TextField
                                                                    select
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    value={client.lang}
                                                                    onChange={(e) => {
                                                                        setClient(prevState => ({
                                                                            ...prevState,
                                                                            "lang": e.target.value
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
                                                                    <MenuItem value={"fr"}>Français</MenuItem>
                                                                    <MenuItem value={"en"}>Anglais</MenuItem>
                                                                </TextField> :
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                    {client.lang === "fr" ? "Français" :"Anglais"}
                                                                </Typography>
                                                        }
                                                    </div>

                                                    {
                                                        editFact === true ?
                                                            <div className="col-md-12">
                                                                <div className="row">
                                                                    <div className="col-md-4">
                                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Rue</Typography>
                                                                        <TextField
                                                                            type={"text"}
                                                                            variant="outlined"
                                                                            inputMode="text"
                                                                            value={client.adresse.street}
                                                                            onChange={(e) => {
                                                                                let adr = client.adresse
                                                                                adr.street = e.target.value
                                                                                setClient(prevState => ({
                                                                                    ...prevState,
                                                                                    "adresse": adr
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
                                                                    <div className="col-md-2">
                                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Code postal</Typography>
                                                                        <TextField
                                                                            type={"number"}
                                                                            variant="outlined"
                                                                            inputMode="text"
                                                                            value={client.adresse.postalCode}
                                                                            onChange={(e) => {
                                                                                let adr = client.adresse
                                                                                adr.postalCode = e.target.value
                                                                                setClient(prevState => ({
                                                                                    ...prevState,
                                                                                    "adresse": adr
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
                                                                    <div className="col-md-2">
                                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Ville</Typography>
                                                                        <TextField
                                                                            type={"text"}
                                                                            variant="outlined"
                                                                            inputMode="text"
                                                                            value={client.adresse.city}
                                                                            onChange={(e) => {
                                                                                let adr = client.adresse
                                                                                adr.city = e.target.value
                                                                                setClient(prevState => ({
                                                                                    ...prevState,
                                                                                    "adresse": adr
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
                                                                    <div className="col-md-3">
                                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Pays</Typography>
                                                                        <Autocomplete
                                                                            autoComplete={"off"}
                                                                            autoHighlight={false}
                                                                            size="small"
                                                                            options={countryList}
                                                                            noOptionsText={""}
                                                                            getOptionLabel={(option) => option.label || ""}
                                                                            renderOption={(props, option) => (
                                                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                                                    <img
                                                                                        loading="lazy"
                                                                                        width="20"
                                                                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                                                        alt=""
                                                                                    />
                                                                                    {option.label} ({option.code})
                                                                                </Box>
                                                                            )}
                                                                            value={countryList.find(x => x.label === client.adresse.pays) ? countryList.find(x => x.label === client.adresse.pays) : ""}
                                                                            onChange={(event, value) => {
                                                                                let adr = client.adresse
                                                                                adr.pays = value ? (value.label || "") : ""
                                                                                setClient(prevState => ({
                                                                                    ...prevState,
                                                                                    "adresse": adr
                                                                                }))
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant={"outlined"}
                                                                                    value={countryList.findIndex(x => x.label === client.adresse.pays) > -1 ? client.adresse.pays : ""}
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
                                                            </div> :
                                                            <div className="col-md-6">
                                                                <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>Adresse</Typography>
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#000"}}>
                                                                    {projectFunctions.get_client_adress(client)}
                                                                </Typography>
                                                            </div>
                                                    }

                                                    {
                                                        editFact === true &&
                                                        <div className="col-md-2">
                                                            <MuiButton
                                                                disabled={client.adresse.street.trim().length < 3 || client.adresse.postalCode.length < 4
                                                                    || client.adresse.city.trim() === "" || client.adresse.pays === ""}
                                                                onClick={() => {
                                                                    setEditFact(false)
                                                                    update_client(client)
                                                                }}
                                                                size={"medium"}
                                                                color="primary"
                                                                variant="contained"
                                                                style={{textTransform: 'capitalize', color: "#fff", fontWeight: 700,marginTop:22}}
                                                            >
                                                                Modifier
                                                            </MuiButton>
                                                        </div>
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div>
                                    <ShimmerCategoryList items={1} categoryStyle="STYLE_SEVEN" />
                                </div>
                        }
                    </div>
                </div>
                <div className="card">
                    <div className="card-body" style={{minHeight:500}}>
                        <div style={{display:"flex",justifyContent:"space-between"}} className="mb-3">
                            <Typography variant="h6" style={{fontWeight:700}} color="primary">Dossiers ouverts</Typography>
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           startIcon={<CreateNewFolderOutlinedIcon style={{color: "#fff"}}/>}
                                           onClick={() => {
                                               setOpenNewFolderModal(true)
                                           }}
                                >
                                    Ouverture dossier
                                </MuiButton>
                            </div>
                        </div>
                        <hr style={{color:"#EDF2F7"}}/>
                        <div>
                            <div style={{marginTop:20}}>
                                {
                                    client_folders && client_folders.length > 0 ?
                                        <Collapse>
                                            {
                                                client_folders && client_folders.map((doss,key) =>
                                                    <Panel key={key} headerClass="mandat_collapse_header"
                                                           header={
                                                               <div>
                                                                   <div>
                                                                       <Typography style={{fontSize:"1rem"}}>{doss.name}</Typography>
                                                                   </div>
                                                               </div>
                                                           }
                                                    >
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                                                    <Typography variant={"subtitle1"} style={{alignSelf:"center",fontWeight:700}} color={"primary"}>
                                                                        Crée par : {localStorage.getItem("email") === doss.created_by ? "Vous" : doss.created_by }
                                                                    </Typography>
                                                                    <MuiButton color="danger"
                                                                        onClick={() => {
                                                                            let id_group = doss.id.split('/')
                                                                            doss.id = id_group[1]
                                                                            setToDeleteFolder(doss)
                                                                            setOpenDeleteModal(true)
                                                                        }}
                                                                        startIcon={<DeleteOutlineIcon/>}
                                                                        style={{fontWeight:700,alignSelf:"center"}}
                                                                    >Supprimer
                                                                    </MuiButton>
                                                                </div>
                                                                <hr style={{color:"#EDF2F7",marginTop:10,marginBottom:10}}/>
                                                            </div>
                                                        </div>

                                                        <div className="row mt-2">
                                                            <div className="col-md-6">
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Nom du dossier</Typography>
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="text"
                                                                    value={doss.name}
                                                                    style={{width: "100%"}}
                                                                    size="small"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                        style: {
                                                                            color: "black",
                                                                            fontSize: 16
                                                                        }
                                                                    }}
                                                                    inputProps={{
                                                                        readOnly:true
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row" style={{marginTop:20}}>
                                                            <div className="col-md-6">
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Contrepartie</Typography>
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="text"
                                                                    value={doss.contrepartie}
                                                                    onChange={(e) => {
                                                                        doss.contrepartie = e.target.value
                                                                        setUpdateScreen(!updateScreen)
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
                                                            <div className="col-md-6">
                                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Autres parties</Typography>
                                                                <TextField
                                                                    type={"text"}
                                                                    variant="outlined"
                                                                    inputMode="text"
                                                                    value={doss.autrepartie}
                                                                    onChange={(e) => {
                                                                        doss.autrepartie = e.target.value
                                                                        setUpdateScreen(!updateScreen)
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

                                                        <div>
                                                            <div className="row mt-2">
                                                                <div className="col-md-6"
                                                                     style={{minWidth: 500}}>
                                                                    <div style={{display: 'flex',marginTop:20}}>
                                                                        <Typography style={{fontSize:"0.95rem"}}>Associés</Typography>
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{
                                                                                marginTop: -5,
                                                                                marginLeft: 6,
                                                                                alignSelf: "center"
                                                                            }}
                                                                            onClick={() => {
                                                                                (doss.associate || []).push({
                                                                                    id: "",
                                                                                    price: ""
                                                                                })
                                                                                setUpdateScreen(!updateScreen)
                                                                            }}>
                                                                            <AddCircleIcon color="primary"/>
                                                                        </IconButton>
                                                                    </div>
                                                                    {
                                                                        doss.associate.map((item, key) =>
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'flex-start',
                                                                                marginTop:10
                                                                            }}>
                                                                                <div style={{alignSelf: "center"}}>
                                                                                    <Typography variant="subtitle1" style={{fontSize: 13, color: "#616161"}}>Associé</Typography>
                                                                                    <Autocomplete
                                                                                        style={{width:200}}
                                                                                        autoComplete={"off"}
                                                                                        autoHighlight={false}
                                                                                        size="small"
                                                                                        options={oa_users}
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
                                                                                        value={(oa_users || []).find(x => x.id === item.id) ? oa_users.find(x => x.id === item.id) : "" }
                                                                                        onChange={(event, value) => {
                                                                                            doss.associate[key].id = value.id
                                                                                            let find = oa_users.find(x => x.id === value.id)
                                                                                            doss.associate[key].price = find.price || ""
                                                                                            setUpdateScreen(!updateScreen)
                                                                                        }}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                variant={"outlined"}
                                                                                                value={oa_users.findIndex(x => x.id === item.id) > -1 ? item.id : ""}
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
                                                                                <div style={{alignSelf: "center"}}>
                                                                                    <Typography variant="subtitle1" style={{fontSize: 13, color: "#616161",marginLeft:10}}>Taux horaire</Typography>
                                                                                    <TextField
                                                                                        type={"text"}
                                                                                        variant="outlined"
                                                                                        inputMode="tel"
                                                                                        value={doss.associate[key].price}
                                                                                        onChange={(e) => {
                                                                                            doss.associate[key].price = e.target.value
                                                                                            setUpdateScreen(!updateScreen)
                                                                                        }}
                                                                                        style={{
                                                                                            width: 210,
                                                                                            marginLeft: 10
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
                                                                                <div style={{alignSelf:"center"}}>
                                                                                    <IconButton
                                                                                        title="Supprimer cette ligne"
                                                                                        style={{
                                                                                            marginLeft: 10,
                                                                                            marginTop:20
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            doss.associate.splice(key, 1)
                                                                                            setUpdateScreen(!updateScreen)
                                                                                        }}
                                                                                    >
                                                                                        <DeleteOutlineIcon color="error"/>
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div align="right" className="mt-3">
                                                            <div style={{display:"flex",justifyContent:"end"}}>
                                                                <div style={{alignSelf:"center"}}>
                                                                    <MuiButton color="primary" size="medium"
                                                                               style={{textTransform:"none",fontWeight:700}}
                                                                               onClick={() => {}}
                                                                               variant="outlined"
                                                                    >
                                                                        Annuler
                                                                    </MuiButton>
                                                                </div>
                                                                <div style={{alignSelf:"center"}}>
                                                                    <MuiButton
                                                                        variant="contained" color="primary" size="medium"
                                                                        style={{textTransform:"none",fontWeight:700,marginLeft:15}}
                                                                        disabled={doss.name.trim() === "" || verif_associate(doss.associate) === false}
                                                                        onClick={() => {
                                                                            console.log(doss)
                                                                            update_folder(doss.id,doss)
                                                                        }}
                                                                    >
                                                                        Enregistrer
                                                                    </MuiButton>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </Panel>
                                                )
                                            }
                                        </Collapse> :
                                        <div>
                                            <Typography variant="subtitle1" style={{fontWeight:700}} color="default">
                                                Aucun dossier encore crée pour ce client
                                            </Typography>
                                        </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal backdrop={true} role="alertdialog" open={openDeleteModal}
                   onClose={() => {setOpenDeleteModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    <Typography variant="h6" color="primary" style={{fontWeight:700,fontSize:16}}>
                        Supprimer dossier
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toDeleteFolder &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de supprimer le dossier &nbsp;<b>{toDeleteFolder.name}</b>
                            </Typography>
                        </div>
                    </Modal.Body>
                }

                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700}}
                               onClick={() => {
                                   setOpenDeleteModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="danger" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                               onClick={() => {
                                   delete_folder(toDeleteFolder.id)
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>

            <Dialog
                open={openNewFolderModal}
                onClose={() => setOpenNewFolderModal(false)}
                aria-labelledby="form-dialog-title"
                fullWidth={"md"}
                style={{zIndex: 100}}

            >
                <DialogTitle disableTypography id="form-dialog-title">
                    <Typography variant="h6" color="primary" style={{fontWeight: 700}}>Ouverture du dossier</Typography>
                    <IconButton
                        aria-label="close"
                        style={{
                            position: 'absolute',
                            right: 5,
                            top: 5,
                            color: '#000'
                        }}
                        onClick={() => {
                            setOpenNewFolderModal(false)
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <hr style={{marginBottom: 2, marginTop: 15}}/>
                </DialogTitle>
                <DialogContent style={{overflowY: "inherit"}}>
                    <div className="pr-1">
                        <div className="row ">
                            <div className="col-md-12">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Nom du dossier</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={folder.name}
                                    onChange={(e) => {handleChangeFolder('name', e.target.value)}}
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
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col-md-6">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Contrepartie</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={folder.contrepartie}
                                    onChange={(e) => {handleChangeFolder('contrepartie', e.target.value)}}
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
                            <div className="col-md-6">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Autres parties</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={folder.autrepartie}
                                    onChange={(e) => {handleChangeFolder('autrepartie', e.target.value)}}
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
                        <div>
                            <div className="row mt-2">
                                <div className="col-md-6"
                                     style={{minWidth: 500}}>
                                    <div style={{display: 'flex',marginTop:15,marginBottom:10}}>
                                        <Typography style={{fontSize:"0.95rem"}}>Associés</Typography>
                                        <IconButton
                                            size="small"
                                            style={{
                                                marginTop: -5,
                                                marginLeft: 6,
                                                alignSelf: "center"
                                            }}
                                            onClick={() => {
                                                let associes = folder.associate || []
                                                associes.push({
                                                    id: "",
                                                    price: ""
                                                });
                                                handleChangeFolder("associate",associes)
                                            }}>
                                            <AddCircleIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                    {
                                        folder.associate.map((item, key) =>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start'
                                            }}>
                                                <div style={{alignSelf: "center"}}>
                                                        <Typography variant="subtitle1" style={{fontSize: 13, color: "#616161"}}>Associé</Typography>
                                                        <Autocomplete
                                                            style={{width:200}}
                                                            autoComplete={"off"}
                                                            autoHighlight={false}
                                                            size="small"
                                                            options={oa_users}
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
                                                            value={oa_users.find(x => x.id === item.id) ? oa_users.find(x => x.id === item.id) : "" }
                                                            onChange={(event, value) => {
                                                                console.log(value)
                                                                let cp = folder
                                                                cp.associate[key].id = value.id
                                                                let find = oa_users.find(x => x.id === value.id)
                                                                cp.associate[key].price = find.price || ""
                                                                handleChangeFolder("associate",cp.associate)
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant={"outlined"}
                                                                    value={oa_users.findIndex(x => x.id === item.id) > -1 ? item.id : ""}
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
                                                <div style={{alignSelf: "center",}}>
                                                    <Typography variant="subtitle1" style={{fontSize: 13, color: "#616161",marginLeft:10}}>Taux horaire</Typography>
                                                    <TextField
                                                        type={"text"}
                                                        variant="outlined"
                                                        inputMode="tel"
                                                        value={folder.associate[key].price}
                                                        onChange={(e) => {
                                                            let cp = folder
                                                            cp.associate[key].price = e.target.value
                                                            handleChangeFolder("associate",cp.associate)
                                                        }}
                                                        style={{
                                                            width: 210,
                                                            marginLeft: 10
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
                                                <div style={{alignSelf:"center"}}>
                                                    <IconButton
                                                        title="Retirer de la liste"
                                                        style={{
                                                            marginLeft: 10,
                                                            marginTop:20
                                                        }}
                                                        onClick={() => {
                                                            let cp = folder
                                                            folder.associate.splice(key, 1)
                                                            handleChangeFolder("associate",cp.associate)
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon color="error"/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{paddingRight: 30, paddingBottom: 15}}>
                    <MuiButton
                        onClick={() => {
                            setOpenNewFolderModal(false)
                        }}
                        color="primary"
                        variant="outlined"
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton
                        disabled={folder.name.trim() === "" || verif_associate(folder.associate) === false}
                        onClick={() => {
                            create_folder()
                        }}
                        color="primary"
                        variant="contained"
                        style={{textTransform: 'capitalize', color: "#fff", fontWeight: 700}}
                    >
                        Ajouter
                    </MuiButton>
                </DialogActions>
            </Dialog>

        </div>
    )}