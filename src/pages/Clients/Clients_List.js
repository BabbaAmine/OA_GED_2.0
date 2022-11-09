import React, {useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Avatar} from 'primereact/avatar';
import {Button} from 'primereact/button';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Project_functions from "../../tools/project_functions";
import {toast} from "react-toastify";
import {ShimmerTable} from "react-shimmer-effects";
import {
    Button as MuiButton, IconButton, Dialog, InputAdornment,
    DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import utilFunctions from "../../tools/functions";
import {countryList,alphabet} from "../../data/data";
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from "@mui/icons-material/Close";
import ApiBackService from "../../provider/ApiBackService";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from '@mui/material/Box';
import {Modal} from "rsuite";
import projectFunctions from "../../tools/project_functions";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PQueue from "p-queue";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import CheckIcon from '@mui/icons-material/Check';
import _ from "lodash"

export default function Clients_List(props) {


    const screenSize = useWindowSize()
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false);

    const [clients, setClients] = React.useState();
    const [oa_users, setOa_users] = React.useState();
    const [openNewClientModal, setOpenNewClientModal] = React.useState();
    const [newClientType, setNewClientType] = React.useState(0);
    const [newClientName1, setNewClientName1] = React.useState("");
    const [newClientName2, setNewClientName2] = React.useState("");
    const [newClientEmail, setNewClientEmail] = React.useState("");
    const [newClientPhone, setNewClientPhone] = React.useState("");
    const [newClientAdress, setNewClientAdress] = React.useState({
        street: "",
        postal_code: "",
        city: "",
        pays: "Switzerland"
    });
    const [newClientLanguage, setNewClientLanguage] = React.useState("fr");
    const [toDeleteClient, setToDeleteClient] = React.useState();
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [showSearchForm, setShowSearchForm] = React.useState(true);
    const [showFolderSearchForm, setShowFolderSearchForm] = React.useState(false);
    const [textSearch, setTextSearch] = React.useState("");
    const [searchByType, setSearchByType] = React.useState(-1);
    const [search_contrepartie, setSearch_contrepartie] = React.useState("");
    const [search_autrepartie, setSearch_autrepartie] = React.useState("");
    const [searchByEmail, setSearchByEmail] = React.useState("");
    const [allFolders, setAllFolders] = React.useState();
    const [filterContrepartie, setFilterContrepartie] = React.useState();
    const [filterAutrepartie, setFilterAutrepartie] = React.useState();

    const searchFilter = (clients || []).filter((client) => ((client.name_2 + " " + client.name_1).toLowerCase().indexOf(textSearch.toLowerCase()) !== -1 &&
        (client.email && client.email.toLowerCase().indexOf(searchByEmail.toLowerCase()) !== -1) &&
        (client.type === searchByType || searchByType === -1)
    ))

    useEffect(() => {
        !clients && get_clients()
        !oa_users && get_oa_users()
    }, [clients])

    const get_oa_users = async () => {
        let oa_users = await Project_functions.get_oa_users({},"",1,200)
        if(oa_users && oa_users !== "false"){
            setOa_users(oa_users)
        }else{
            console.error("ERROR GET LIST USERS")
        }
    }

    const get_client_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL","test","annuaire_clients_mandat").then( res => {
            let filtred_data = res.filter(x => x.admin_odoo_id && x.admin_odoo_id === "796dc0ed-8b4a-40fd-aeff-7ce26ee1bcf9")
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            filtred_data.map((item, key) => {
                let data = {
                    type: item.Type ? parseInt(item.Type) : 0,
                    name_1: item.Prenom || "",
                    name_2: item.Nom || "",
                    email: item.email,
                    phone: item.phone || "",
                    adresse: {
                        street: item.adress_fact_street || "", postalCode: item.adress_fact_pc || "",
                        city: item.adress_fact_city || "", pays: item.adress_fact_country ? (item.adress_fact_country === "43" ? "Switzerland" : "") : "",
                        extra:{
                            id:item.id || "false",
                            ID:item.ID || "false"
                        }
                    },
                    lang: item.lang_fact ? (item.lang_fact === "en_US" ? "en" : "fr") : "fr",
                }
                calls.push(
                    () => ApiBackService.add_client(data).then( r => {
                        console.log("CLIENT " + data.name_1 + " ADDED")
                        return ("CLIENT " + data.name_1 + " ADDED")
                    })
                )
            })
            queue.addAll(calls).then( final => {
                console.log(final)
                setLoading(false)
            }).catch( err => {
                console.log(err)
                setLoading(false)
            })


        }).catch( err => console.log(err))
    }

    const get_client_folders_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL","test","clients_cases").then( res => {
            let filtred_data = res.filter(x => x.admin_odoo_id && x.admin_odoo_id === "796dc0ed-8b4a-40fd-aeff-7ce26ee1bcf9")
            console.log(filtred_data)
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            filtred_data.map( item => {
                console.log("ENTER FIRST LOOP");
                (item.folders || []).map( folder => {
                    let data = {
                        autrepartie: folder.autrepartie || "",
                        conterpart: folder.contrepartie || "",
                        name: folder.name || "",
                        user_in_charge: "",
                        user_in_charge_price: "",
                        extra:{
                            v1_folder_id:folder.folder_id
                        },
                        associate:[]
                    };
                    (folder.team || []).map( user => {
                        if(user.email && user.email !== "" && projectFunctions.get_user_id_by_email(oa_users,user.email) !== "false"){
                            data.associate.push({
                                id:projectFunctions.get_user_id_by_email(oa_users,user.email),
                                price:(user.tarif && user.tarif !== "" && parseFloat(user.tarif) > 0) ? parseFloat(user.tarif) : ""
                            })
                        }
                    });
                    if(item.ID_client && item.ID_client !== ""){
                        let find_client = (clients || []).find(x => x.adresse.extra.ID === item.ID_client || x.adresse.extra.id === item.ID_client)
                        if(find_client){
                            calls.push(
                                () => ApiBackService.create_client_folder(find_client.id,data).then( r => {
                                    if (r.status === 200 && r.succes === true) {
                                        console.log("FOLDER" + data.name + " ADDED")
                                    }else{
                                        console.log("ERROR ADD: " + data.name)
                                    }
                                    return ("FOLDER " + data.name + " ADDED")
                                })
                            )
                        }
                    }

                });
            });
            queue.addAll(calls).then( final => {
                console.log(final)
                setLoading(false)
            }).catch( err => {
                console.log(err)
                setLoading(false)
            })


        }).catch( err => console.log(err))
    }

    const delete_all_client = () => {
        setLoading(true)

        let queue = new PQueue({concurrency: 1});
        let calls = [];
        (clients || []).map((item, key) => {
            calls.push(
                () => ApiBackService.delete_client(item.id).then( r => {
                    console.log("CLIENT " + item.id + " REMOVED")
                    return ("CLIENT " + item.id + " REMOVED")
                })
            )
        })
        queue.addAll(calls).then( final => {
            console.log(final)
            setLoading(false)
        }).catch( err => {
            console.log(err)
            setLoading(false)
        })
    }

    const delete_all_folders = () => {
        setLoading(true)

        ApiBackService.get_all_folders({filter: {}, exclude: ""},1,1000).then( res => {
            if (res.status === 200 && res.succes === true) {
                let all_folders = res.data.list
                let queue = new PQueue({concurrency: 1});
                let calls = [];
                (all_folders || []).map((item, key) => {
                    calls.push(
                        () => ApiBackService.delete_client_folder(item.id.split("/").shift(),item.id.split("/").pop()).then( r => {
                            if (r.status === 200 && r.succes === true) {
                                console.log("FOLDER " + item.name + " REMOVED")
                            }else{
                                console.log("ERROR DELETE " + item.name)
                            }
                            return ("FOLDER " + item.name + " REMOVED")
                        })
                    )
                })
                queue.addAll(calls).then( final => {
                    console.log(final)
                    setLoading(false)
                }).catch( err => {
                    console.log(err)
                    setLoading(false)
                })
            }else{
                console.log("ERROR GET FOLDERS")
            }
        }).catch( err => console.log(err))
    }

    const get_clients = async () => {
        let clients = await Project_functions.get_clients({}, "", 1, 10000)
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
            toast.error("Une erreur est survenue, veuillez recharger la page")
        }
    }

    const add_new_client = () => {
        setOpenNewClientModal(false)
        setLoading(true)
        let data = {
            type: newClientType,
            name_1: newClientName1,
            name_2: newClientName2,
            email: newClientEmail,
            phone: newClientPhone,
            adresse: {
                street: newClientAdress.street, postalCode: newClientAdress.postal_code,
                city: newClientAdress.city, pays: newClientAdress.pays
            },
            lang: newClientLanguage
        }
        ApiBackService.add_client(data).then(res => {
            if (res.status === 200 && res.succes === true) {
                toast.success("L'ajout du nouveau client est effectué avec succès !")
                reset_add_modal()
                setClients()
                get_clients()
                navigate("/home/clients/details/" + res.data.id)
                setLoading(false)
            } else {
                toast.error(res.error || "Une erreur est survenue, veuillez recharger la page")
                setLoading(false)
            }
        }).catch(err => {
            toast.error("Une erreur est survenue, veuillez recharger la page")
            setLoading(false)
        })
    }

    const delete_client = (client_id) => {
        setOpenDeleteModal(false)
        setLoading(true)
        ApiBackService.delete_client(client_id).then(res => {
            if (res.status === 200 && res.succes === true) {
                toast.success("La suppression du client est effectué avec succès !")
                setClients()
                get_clients()
                setLoading(false)
            } else {
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch(err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const search_folders = (autrepartie,contrepartie) => {
        setLoading(true)
        ApiBackService.get_all_folders({filter:{},exclude:""},1,10000).then( res => {
            console.log(res)
            let data = res.data.list
            let data_copy = res.data.list
            let filter_contrepartie = data.filter(x => x.conterpart.toLowerCase().indexOf(contrepartie.toLowerCase()) !== -1 && contrepartie.trim() !== "")
            let filter_autrepartie = data_copy.filter(x => x.autrepartie.toLowerCase().indexOf(autrepartie.toLowerCase()) !== -1 && autrepartie.trim() !== "")
            console.log(filter_contrepartie)
            console.log(filter_autrepartie)
            if(res.status === 200 && res.succes === true){
                setAllFolders(res.data.list)
                setFilterContrepartie(filter_contrepartie)
                setFilterAutrepartie(filter_autrepartie)
                setLoading(false)
            }else{
                setLoading(false)
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
        }).catch( err => {
            console.log(err)
            setLoading(false)
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
        })
    }

    const clear_search_form = () => {
        setSearchByType(-1)
        setSearchByEmail("")
        setTextSearch("")
    }

    const reset_add_modal = () => {
        setNewClientName1("")
        setNewClientName2("")
        setNewClientType(0)
        setNewClientPhone("")
        setNewClientEmail("")
        setNewClientAdress({street: "", postal_code: "", city: "", pays: ""})
    }

    const renderClient = (id) => {
        let find_client = (clients || []).find(x => x.id === id)
        let name = ""
        if(find_client) name = projectFunctions.get_client_title(find_client)
        return(
            <b style={{color:"#1565C0",textDecoration:"underline",cursor:"pointer"}}
               onClick={() => {
                   find_client && find_client.id && navigate("/home/clients/details/" + find_client.id)
               }}
            >
                {name}
            </b>
        )
    }

    const renderFnameTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Avatar icon={rowData.type === 0 ? <BusinessOutlinedIcon color="primary"/> :
                    <PersonOutlineOutlinedIcon color="primary"/>} shape="circle" size={"normal"}
                        style={{verticalAlign: 'middle', backgroundColor: "unset"}}/>
                <span style={{verticalAlign: 'middle', marginLeft: "0.5rem", color: "#000", fontWeight: 600}}>
                    {(rowData.name_2 || "") + (rowData.name_1 && rowData.name_1.trim() !== "" ? (" " + rowData.name_1) : "")}
                </span>
            </React.Fragment>
        );
    }

    const renderActionsTemplate = (rowData) => {
        return (
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate("/home/clients/details/" + rowData.id)
                            }}
                >
                    <VisibilityOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToDeleteClient(rowData)
                                setOpenDeleteModal(true)
                            }}
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        )
    }


    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text"
                                  onClick={() => {
                                      setClients()
                                      get_clients()
                                  }}
    />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text"
                                   style={{display: "none"}}/>;

    return (
        <div>
            <MuiBackdrop open={loading} text={"Chargement..."}/>
            <div className="container-fluid container-lg"
                 style={{marginTop: 60, height: screenSize.height - 80, overflowX: "auto"}}>
                <div className="card">
                    <div className="card-body">
                        <div style={{display: "flex", justifyContent: "space-between"}} className="mb-3">
                            <Typography variant="h6" style={{fontWeight: 700}} color="primary">Clients</Typography>
                            {/*<div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               delete_all_client()
                                           }}
                                >
                                    Delete All Clients
                                </MuiButton>
                            </div>
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               delete_all_folders()
                                           }}
                                >
                                    Delete All Folders
                                </MuiButton>
                            </div>
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               get_client_from_v1()
                                           }}
                                >
                                    Import from V1
                                </MuiButton>
                            </div>
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               get_client_folders_from_v1()
                                           }}
                                >
                                    Import folders from V1
                                </MuiButton>
                            </div>*/}
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           startIcon={<AddIcon style={{color: "#fff"}}/>}
                                           onClick={() => {
                                               setOpenNewClientModal(true)
                                           }}
                                >
                                    Ajouter client
                                </MuiButton>
                            </div>
                        </div>
                        <hr style={{color: "#EDF2F7", marginBottom: 15}}/>
                        {/*<div style={{display: "flex", cursor: "pointer"}}
                             onClick={() => {setShowSearchForm(!showSearchForm)}}
                        >
                            <SearchOutlinedIcon color="primary" style={{alignSelf: "center"}}/>
                            <Typography variant="subtitle1"
                                        style={{fontWeight: 700, alignSelf: "center", marginLeft: 5}}
                                        color="primary">Rechercher
                            </Typography>
                        </div>*/}
                        <div style={{display:"flex",alignSelf:"center",justifyContent:"space-between"}}>
                            <div style={{display: "flex", cursor: "pointer"}}
                                 onClick={() => {setShowSearchForm(!showSearchForm)}}
                            >
                                {
                                    !showSearchForm ?
                                        <ChevronRightIcon color="primary" style={{alignSelf: "center"}} /> : <ExpandMoreIcon color="primary" style={{alignSelf: "center"}}/>
                                }
                                <Typography variant="subtitle1"
                                            style={{fontWeight: 700, alignSelf: "center", marginLeft: 5}}
                                            color="primary">Rechercher
                                </Typography>
                                <SearchOutlinedIcon color="primary" style={{alignSelf: "center", marginLeft: 5}}/>
                            </div>
                            <div style={{alignSelf:"center"}}>
                                {
                                    showSearchForm &&
                                    <MuiButton variant="text" color="primary" size="medium"
                                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                                               startIcon={<ClearAllOutlinedIcon color="primary"/>}
                                               onClick={() => {
                                                   clear_search_form()
                                               }}
                                    >
                                        Réinitialiser
                                    </MuiButton>
                                }
                            </div>
                        </div>
                        {
                            showSearchForm &&
                            <div>
                                <div className="row mt-1 ml-1">
                                    <div className="col-lg-4">
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Par Nom</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={textSearch}
                                            onChange={(e) =>
                                                setTextSearch(e.target.value)
                                            }
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
                                    <div className="col-lg-4">
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Par Type</Typography>
                                        <TextField
                                            select
                                            type={"text"}
                                            variant="outlined"
                                            value={searchByType}
                                            onChange={(e) =>
                                                setSearchByType(e.target.value)
                                            }
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
                                            <MenuItem value={-1}>Tous</MenuItem>
                                            <MenuItem value={0}>Une société</MenuItem>
                                            <MenuItem value={1}>Personne physique</MenuItem>
                                        </TextField>
                                    </div>
                                    <div className="col-lg-4">
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Par Email</Typography>
                                        <TextField
                                            type={"email"}
                                            variant="outlined"
                                            value={searchByEmail}
                                            onChange={(e) =>
                                                setSearchByEmail(e.target.value)
                                            }
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
                            </div>
                        }


                        <div className="mt-1">
                            {
                                !clients ?
                                    <ShimmerTable row={3} col={4} size={"sm"}/> :
                                    <div>
                                        <div className="mt-3">
                                            <DataTable value={searchFilter}
                                                       paginator
                                                       paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                       currentPageReportTemplate="Montrant {first} à {last} sur {totalRecords}"
                                                       rows={5} rowsPerPageOptions={[5, 10, 20, 50]}
                                                       paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                                                       onRowClick={(e) => {
                                                           navigate("/home/clients/details/" + e.data.id)
                                                       }}
                                                       rowHover={true}
                                                       selectionMode={"single"}
                                                       removableSort={true}
                                                       size="small"
                                                       emptyMessage="Aucun résultat trouvé"
                                            >
                                                <Column header="Nom du client" body={renderFnameTemplate} sortable
                                                        sortField="name_1"></Column>
                                                <Column field="email" header="Email"></Column>
                                                <Column field="phone" header="Téléphone"></Column>
                                                <Column field="" header="Actions" body={renderActionsTemplate}></Column>
                                            </DataTable>
                                        </div>
                                    </div>

                            }
                        </div>
                    </div>

                </div>

                <div className="card">
                    <div className="card-body">
                        <div style={{display: "flex", justifyContent: "space-between"}} className="mb-3">
                            <Typography variant="h6" style={{fontWeight: 700}} color="primary">Chercher des contrepartie/autrepartie</Typography>
                        </div>
                        <hr style={{color: "#EDF2F7", marginBottom: 15}}/>
                        <div className="row mt-2">
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Contrepartie</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={search_contrepartie}
                                    onChange={(e) =>
                                        setSearch_contrepartie(e.target.value)
                                    }
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
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Autrepartie</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={search_autrepartie}
                                    onChange={(e) =>
                                        setSearch_autrepartie(e.target.value)
                                    }
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
                            <div className="col-lg-4 mb-1">
                                <div style={{display:"flex",justifyContent:"center"}}>
                                    <MuiButton variant="contained" color="primary" size="small"
                                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem",marginTop:30}}
                                               startIcon={<CheckIcon color="white"/>}
                                               onClick={() => {
                                                   search_folders(search_autrepartie,search_contrepartie)
                                               }}
                                    >
                                        Appliquer
                                    </MuiButton>
                                    <MuiButton variant="outlined" color="primary" size="small"
                                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem",marginTop:30}}
                                               onClick={() => {
                                                   setAllFolders()
                                                   setFilterAutrepartie()
                                                   setFilterContrepartie()
                                                   setSearch_autrepartie("")
                                                   setSearch_contrepartie("")
                                               }}
                                    >
                                        Annuler
                                    </MuiButton>
                                </div>
                            </div>
                        </div>
                        {
                            (filterContrepartie && filterContrepartie.length > 0) &&
                                <div className="mt-2">
                                    <Typography variant="subtitle1" style={{fontWeight: 700}} color="primary">Contrepartie</Typography>
                                    <ul style={{backgroundColor:"#F9F9F9",paddingTop:10,paddingBottom:10,marginTop:5}} className="ml-2">
                                        {
                                            filterContrepartie.map((item,key) => (
                                                <li key={key} style={{lineHeight:"1.7rem",marginLeft:25}}>
                                                    <Typography variant="subtitle1" style={{fontWeight: 500}} color="grey">
                                                        <b style={{color:"#1565C0"}}>{item.conterpart}</b>&nbsp;est une contrepartie dans le dossier&nbsp;<b style={{color:"#1565C0"}}>{item.name}</b>&nbsp;
                                                        du client&nbsp;{renderClient(item.id.split("/").shift())}
                                                    </Typography>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                        }
                        {
                            (filterAutrepartie && filterAutrepartie.length > 0) &&
                            <div className="mt-2">
                                <Typography variant="subtitle1" style={{fontWeight: 700}} color="primary">Autrepartie</Typography>
                                <ul style={{backgroundColor:"#F9F9F9",paddingTop:10,paddingBottom:10,marginTop:5}} className="ml-2">
                                    {
                                        filterAutrepartie.map((item,key) => (
                                            <li key={key} style={{lineHeight:"1.7rem",marginLeft:25}}>
                                                <Typography variant="subtitle1" style={{fontWeight: 500}} color="grey">
                                                    <b style={{color:"#1565C0"}}>{item.autrepartie}</b>&nbsp;est une autrepartie dans le dossier&nbsp;<b style={{color:"#1565C0"}}>{item.name}</b>&nbsp;
                                                    du client&nbsp;{renderClient(item.id.split("/").shift())}
                                                </Typography>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>

            </div>

            <Dialog
                open={openNewClientModal}
                aria-labelledby="form-dialog-title"
                fullWidth={"md"}
                style={{zIndex: 100}}

            >
                <DialogTitle disableTypography id="form-dialog-title">
                    <Typography variant="h6" color="primary" style={{fontWeight: 700}}>Ajouter un nouveau client</Typography>
                    <IconButton
                        aria-label="close"
                        style={{
                            position: 'absolute',
                            right: 5,
                            top: 5,
                            color: '#000'
                        }}
                        onClick={() => {
                            reset_add_modal()
                            setOpenNewClientModal(false)
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <hr style={{marginBottom: 2, marginTop: 15}}/>
                </DialogTitle>
                <DialogContent style={{overflowY: "inherit"}}>
                    <div className="pr-1">
                        <div>
                            <div className="row">
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Type</Typography>
                                    <TextField
                                        select
                                        type={"text"}
                                        variant="outlined"
                                        value={newClientType}
                                        onChange={(e) =>
                                            setNewClientType(e.target.value)
                                        }
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
                                        <MenuItem value={0}>Une société</MenuItem>
                                        <MenuItem value={1}>Personne physique</MenuItem>
                                    </TextField>
                                </div>
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Email</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        inputMode="email"
                                        value={newClientEmail}
                                        onChange={(e) =>
                                            setNewClientEmail(e.target.value)
                                        }
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
                                    <Typography variant="subtitle1" style={{
                                        fontSize: 14,
                                        color: "#616161"
                                    }}>{newClientType === 0 ? "Nom du client" : "Nom"}</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        value={newClientName2}
                                        onChange={(e) =>
                                            setNewClientName2(e.target.value)
                                        }
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
                                {
                                    newClientType === 1 &&
                                    <div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1"
                                                    style={{fontSize: 14, color: "#616161"}}>Prénom</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={newClientName1}
                                            onChange={(e) =>
                                                setNewClientName1(e.target.value)
                                            }
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
                                }

                            </div>
                            <div className="row mt-1">

                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Téléphone</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        inputMode="tel"
                                        value={newClientPhone}
                                        onChange={(e) =>
                                            setNewClientPhone(e.target.value)
                                        }
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
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Langue</Typography>
                                    <TextField
                                        select
                                        type={"text"}
                                        variant="outlined"
                                        value={newClientLanguage}
                                        onChange={(e) =>
                                            setNewClientLanguage(e.target.value)
                                        }
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
                                    </TextField>
                                </div>
                            </div>
                            <Typography variant={"subtitle1"} color="primary" className="mt-2">Adresse</Typography>
                            <div className="row mt-1">
                                <div className="col-lg-12 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Rue</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        value={newClientAdress.street}
                                        onChange={(e) =>
                                            setNewClientAdress(prevState => ({
                                                ...prevState,
                                                "street": e.target.value
                                            }))
                                        }
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
                                <div className="col-lg-4 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Code
                                        postal</Typography>
                                    <TextField
                                        type={"number"}
                                        variant="outlined"
                                        value={newClientAdress.postal_code}
                                        onChange={(e) =>
                                            setNewClientAdress(prevState => ({
                                                ...prevState,
                                                "postal_code": e.target.value
                                            }))
                                        }
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
                                <div className="col-lg-4 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Ville</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        value={newClientAdress.city}
                                        onChange={(e) =>
                                            setNewClientAdress(prevState => ({
                                                ...prevState,
                                                "city": e.target.value
                                            }))
                                        }
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
                                <div className="col-lg-4 mb-1">
                                    <Typography variant="subtitle1"
                                                style={{fontSize: 14, color: "#616161"}}>Pays</Typography>
                                    <Autocomplete
                                        autoComplete={"off"}
                                        autoHighlight={false}
                                        size="small"
                                        options={countryList}
                                        noOptionsText={""}
                                        getOptionLabel={(option) => option.label || ""}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
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
                                        value={countryList.find(x => x.label === newClientAdress.pays) ? countryList.find(x => x.label === newClientAdress.pays) : ""}
                                        onChange={(event, value) => {
                                            console.log(value)
                                            setNewClientAdress(prevState => ({
                                                ...prevState,
                                                "pays": value ? (value.label || "") : ""
                                            }))
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                value={countryList.findIndex(x => x.label === newClientAdress.pays) > -1 ? newClientAdress.pays : ""}
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
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{paddingRight: 30, paddingBottom: 15}}>
                    <MuiButton
                        onClick={() => {
                            reset_add_modal()
                            setOpenNewClientModal(false)
                        }}
                        color="primary"
                        variant="outlined"
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton
                        disabled={newClientName2.trim() === "" || utilFunctions.verif_Email(newClientEmail) ||
                            newClientAdress.street.length < 3 || newClientAdress.city.trim() === "" || newClientAdress.postal_code.length < 4}
                        onClick={() => {
                            add_new_client()
                        }}
                        color="primary"
                        variant="contained"
                        style={{textTransform: 'capitalize', color: "#fff", fontWeight: 700}}
                    >
                        Ajouter
                    </MuiButton>
                </DialogActions>
            </Dialog>

            <Modal backdrop={true} role="alertdialog" open={openDeleteModal}
                   onClose={() => {
                       setOpenDeleteModal(false)
                   }} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    <Typography variant="h6" color="primary" style={{fontWeight: 700, fontSize: 16}}>
                        Supprimer client
                    </Typography>
                    <hr style={{marginBottom: 2, marginTop: 15}}/>
                </Modal.Header>
                {
                    toDeleteClient &&
                    <Modal.Body>
                        <div style={{display: "flex"}}>
                            <Typography variant="h6" style={{fontSize: 14}}>
                                Vous êtes sur le point de supprimer le client &nbsp;
                                <b>{projectFunctions.get_client_title(toDeleteClient)}</b>
                            </Typography>
                        </div>
                    </Modal.Body>
                }

                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform: "none", fontWeight: 700}}
                               onClick={() => {
                                   setOpenDeleteModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{
                                   textTransform: "none",
                                   fontWeight: 700,
                                   marginLeft: "1rem",
                                   backgroundColor: "#D50000"
                               }}
                               onClick={() => {
                                   delete_client(toDeleteClient.id)
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>

        </div>
    )
}