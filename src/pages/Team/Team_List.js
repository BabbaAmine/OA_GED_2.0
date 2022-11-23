import React,{useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ApiBackService from "../../provider/ApiBackService";
import {toast} from "react-toastify";
import { ShimmerTable } from "react-shimmer-effects";
import Typography from "@mui/material/Typography";
import {Dialog, DialogActions, DialogContent, DialogTitle, Input, MenuItem, TextField} from "@mui/material";
import utilFunctions from "../../tools/functions";
import userAvatar from "../../assets/images/default_avatar.png"
import InputAdornment from '@mui/material/InputAdornment';
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import { Modal } from 'rsuite';
import Project_functions from "../../tools/project_functions";
import {Button} from "primereact/button";
import {Button as MuiButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import projectFunctions from "../../tools/project_functions";
import PQueue from "p-queue";

export default function Team_List(props) {

    const user_image_upload = React.createRef()

    const screenSize = useWindowSize()
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState();
    const [openNewUserModal, setOpenNewUserModal] = React.useState(false);
    const [newUserImage, setNewUserImage] = React.useState();
    const [newUserFName, setNewUserFName] = React.useState("");
    const [newUserLName, setNewUserLName] = React.useState("");
    const [newUserEmail, setNewUserEmail] = React.useState("");
    const [newUserPrice, setNewUserPrice] = React.useState();
    const [newUserPhone, setNewUserPhone] = React.useState();
    const [openUserModal, setOpenUserModal] = React.useState(false);
    const [toUpdateUser, setToUpdateUser] = React.useState();
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);


    useEffect(() => {
        !users && get_oa_users()
    }, [users])

    const get_team_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL","test","contacts").then( res => {
            let filtred_data = res
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            console.log(filtred_data)
            filtred_data.map((item, key) => {
                let data = {
                    first_name: item.nom,
                    last_name: item.prenom,
                    email: item.email,
                    phone:item.phone || null,
                    price: parseFloat(item.rateFacturation),
                    image: item.imageUrl || null,
                    index: item.sort,
                    extra:{
                        id:item.id || "",
                        uid:item.uid || ""
                    }
                }
                calls.push(
                    () => ApiBackService.update_user(item.id,data).then( r => {
                        console.log("USER " + item.id + " ADDED")
                        return ("USER " + item.id + " ADDED")
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

    const delete_all_team = () => {
        setLoading(true)

        let queue = new PQueue({concurrency: 1});
        let calls = [];
        (users || []).map((item, key) => {
            calls.push(
                () => ApiBackService.delete_user(item.id).then( r => {
                    console.log("USER " + item.id + " REMOVED")
                    return ("USER " + item.id + " REMOVED")
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

    const get_oa_users = async () => {
        let oa_users = await Project_functions.get_oa_users({},"",1,200)
        console.log(oa_users)
        if(oa_users && oa_users !== "false"){
            setUsers(oa_users)
        }else{
            toast.error("Une erreur est survenue, veuillez recharger la page")
        }
    }

    const add_new_user = () => {
        if((users || []).findIndex(x => x.email === newUserEmail) > -1){
            toast.warn("Adresse e-mail déjà utilisée")
        }else{
            setOpenNewUserModal(false)
            setLoading(true)
            let data = {
                first_name: newUserFName,
                last_name: newUserLName,
                email: newUserEmail,
                phone:newUserPhone || null,
                price: parseFloat(newUserPrice),
                image: newUserImage || null,
                index: users.length + 1
            }
            ApiBackService.update_user("tmp_"+utilFunctions.getUID(),data).then( res => {
                if(res.status === 200 && res.succes === true){
                    toast.success("L'ajout du nouveau membre est effectué avec succès !")
                    reset_add_modal()
                    setUsers()
                    get_oa_users()
                }else{
                    toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                }
                setLoading(false)
            }).catch( err => {
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            })
        }

    }

    const update_user = () => {
        setOpenUserModal(false)
        setLoading(true)
        ApiBackService.update_user(toUpdateUser.id,toUpdateUser).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Modification effectuée avec succès !")
                setToUpdateUser()
                setUsers()
                get_oa_users()
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const delete_user = () => {
        setOpenDeleteModal(false)
        setLoading(true)
        ApiBackService.delete_user(toUpdateUser.id).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateUser()
                setUsers()
                get_oa_users()
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const reset_add_modal = () => {
        setNewUserLName("")
        setNewUserFName("")
        setNewUserPrice()
        setNewUserEmail("")
        setNewUserPhone("")
        setNewUserImage()
    }

    const uploadImage = async (files,type) => {
        let imgToUpload = files.target.files[0];
        let b64_image = await utilFunctions.toBase64(imgToUpload)
        if(type && type === "update"){
            setToUpdateUser(prevState => ({
                ...prevState,
                "image": b64_image
            }))
        }else{
            setNewUserImage(b64_image)
        }
    };

    const renderFnameTemplate = (rowData) => {
        return (
            <React.Fragment>
                {
                    rowData.image && rowData.image !== "" ?
                        <img className="rounded-circle text-center"
                             style={{width: "3rem", height: "3rem", objectFit: "contain"}}
                             src={rowData.image}
                             alt=""/> :
                        <Avatar icon="pi pi-user" shape="circle" size={"large"} style={{ verticalAlign: 'middle' }} />
                }
                <span style={{ verticalAlign: 'middle',marginLeft:"0.5rem",color:"#000",fontWeight:600 }}>
                    {rowData.last_name + " " + rowData.first_name }
                </span>
            </React.Fragment>
        );
    }

    const renderRateTemplate = (rowData) => {
        return <span className={"custom-tag status-new"}>{rowData.price + " CHF/h"}</span>;
    }

    const renderActionsTemplate = (rowData) => {
        return(
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateUser(rowData)
                                setOpenUserModal(true)
                            }}
                >
                    <VisibilityOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateUser(rowData)
                                setOpenDeleteModal(true)
                            }}
                >
                    <DeleteOutlineIcon fontSize="small" color="default"/>
                </IconButton>
            </React.Fragment>
        )
    }
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" style={{color:"#1565C0"}}
                                  onClick={() => {
                                      setUsers()
                                      get_oa_users()
                                  }}
    />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" style={{display:"none"}} />;

    return(
        <div>
            <MuiBackdrop open={loading} text={"Chargement..."}/>
            <div className="container-fluid container-lg" style={{marginTop: 60,height:screenSize.height-80,overflowX:"auto"}}>

                <div className="card">
                    <div className="card-body">
                        <div style={{display:"flex",justifyContent:"space-between"}} className="mb-3">
                            <Typography variant="h6" style={{fontWeight:700}} color="primary">Equipe OA</Typography>
                            {/*<div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               delete_all_team()
                                           }}
                                >
                                    Remove All
                                </MuiButton>
                            </div>*/}
                            {/*<div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               get_team_from_v1()
                                           }}
                                >
                                    Import from V1
                                </MuiButton>
                            </div>*/}
                            <div>
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           startIcon={<AddIcon style={{color: "#fff"}}/>}
                                           onClick={() => {
                                               setOpenNewUserModal(true)
                                           }}
                                >
                                    Ajouter membre
                                </MuiButton>
                            </div>
                        </div>
                        <hr style={{color:"#EDF2F7"}}/>
                        {
                            !users ?
                                <ShimmerTable row={3} col={4} size={"sm"} /> :
                                <DataTable value={users}
                                           paginator
                                           paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                           currentPageReportTemplate="Montrant {first} à {last} sur {totalRecords}"
                                           rows={5} rowsPerPageOptions={[5,10,20,50]}
                                           paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                                           onRowClick={(e) => {
                                               setToUpdateUser(e.data)
                                               setOpenUserModal(true)
                                           }}
                                           rowHover={true}
                                           selectionMode={"single"}
                                           style={{border:"1px solid #FOFOFO"}}
                                           size="small"
                                           emptyMessage="Aucun résultat trouvé"
                                >
                                    <Column header="Nom & Prénom" body={renderFnameTemplate}></Column>
                                    <Column field="email" header="Email"></Column>
                                    <Column field="price" header="Taux horaire" body={renderRateTemplate} sortable></Column>
                                    <Column field="" header="Actions" body={renderActionsTemplate}></Column>
                                </DataTable>
                        }

                    </div>

                </div>


            </div>

            <Dialog
                open={openNewUserModal}
                aria-labelledby="form-dialog-title"
                fullWidth={"md"}
                style={{zIndex: 100}}
            >
                <DialogTitle disableTypography id="form-dialog-title">
                    <Typography variant="h6" color="primary" style={{fontWeight:700}}>Ajouter un nouveau membre</Typography>
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
                            setOpenNewUserModal(false)
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <hr style={{marginBottom:5,marginTop:15}}/>
                </DialogTitle>
                <DialogContent style={{overflowY: "inherit"}}>
                    <div className="pr-1">
                        <div className="text-center" align={"center"}>
                                <img onClick={() => user_image_upload.current.click()}
                                     src={newUserImage || userAvatar}
                                     className="rounded-circle avatar-lg img-thumbnail"
                                     alt="" style={{cursor: 'pointer', width: 120, height: 120, objectFit: 'contain'}}
                                />
                                <input style={{visibility: 'hidden', width: 0, height: 0}}
                                       type='file' accept='.png,.jpeg,.jpg'
                                       onChange={(files) => uploadImage(files)}
                                       ref={user_image_upload}
                                />
                            </div>
                        <div className="row mt-3">
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Nom</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        value={newUserLName}
                                        onChange={(e) =>
                                            setNewUserLName(e.target.value)
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
                                    <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Prénom</Typography>
                                    <TextField
                                        type={"text"}
                                        variant="outlined"
                                        value={newUserFName}
                                        onChange={(e) =>
                                            setNewUserFName(e.target.value)
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
                                    <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Email</Typography>
                                    <TextField
                                        type={"text"}
                                        inputMode="email"
                                        variant="outlined"
                                        value={newUserEmail}
                                        onChange={(e) =>
                                            setNewUserEmail(e.target.value)
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
                                {/*<div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Téléphone</Typography>
                                    <TextField
                                        type={"text"}
                                        inputMode="tel"
                                        variant="outlined"
                                        value={newUserPhone}
                                        onChange={(e) =>
                                            setNewUserPhone(e.target.value)
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
                                </div>*/}
                            <div className="col-lg-6 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Taux horaire</Typography>
                                <TextField
                                    type={"number"}
                                    variant="outlined"
                                    value={newUserPrice}
                                    onChange={(e) =>
                                        setNewUserPrice(e.target.value)
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
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">CHF/h</InputAdornment>,
                                    }}
                                />
                            </div>
                            </div>
                    </div>
                </DialogContent>
                <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                    <MuiButton
                        onClick={() => {
                            reset_add_modal()
                            setOpenNewUserModal(false)
                        }}
                        color="primary"
                        variant="outlined"
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton
                        disabled={newUserFName.trim() === "" || newUserLName.trim() === "" ||
                            utilFunctions.verif_Email(newUserEmail) || isNaN(parseFloat(newUserPrice)) || parseFloat(newUserPrice) < 0}
                        onClick={() => {
                            add_new_user()
                        }}
                        color="primary"
                        variant="contained"
                        size={"medium"}
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Ajouter
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {
                toUpdateUser &&
                <Dialog
                    open={openUserModal}
                    aria-labelledby="form-dialog-title"
                    fullWidth={"md"}
                    style={{zIndex: 100}}

                >
                    <DialogTitle disableTypography id="form-dialog-title">
                        <Typography variant="h6" color="primary" style={{fontWeight:700}} >{toUpdateUser.last_name + " " + toUpdateUser.first_name}</Typography>
                        <IconButton
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 5,
                                top: 5,
                                color: '#000'
                            }}
                            onClick={() => {
                                setOpenUserModal(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <hr style={{marginBottom:5,marginTop:15}}/>
                    </DialogTitle>
                    <DialogContent style={{overflowY: "inherit"}}>
                        <div className="pl-1 pr-1 mt-2">
                            <div>
                                <div className="text-center" align={"center"}>
                                    <img onClick={() => user_image_upload.current.click()}
                                         src={toUpdateUser.image || userAvatar}
                                         className="rounded-circle avatar-lg img-thumbnail"
                                         alt="" style={{cursor: 'pointer', width: 120, height: 120, objectFit: 'contain'}}
                                    />
                                    <input style={{visibility: 'hidden', width: 0, height: 0}}
                                           type='file' accept='.png,.jpeg,.jpg'
                                           onChange={(files) => uploadImage(files,"update")}
                                           ref={user_image_upload}
                                    />
                                </div>
                                <div className="row mt-2">
                                    <div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Nom</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateUser.last_name}
                                            onChange={(e) => {
                                                setToUpdateUser(prevState => ({
                                                    ...prevState,
                                                    "last_name": e.target.value
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
                                    <div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Prénom</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateUser.first_name}
                                            onChange={(e) => {
                                                setToUpdateUser(prevState => ({
                                                    ...prevState,
                                                    "first_name": e.target.value
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
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Email</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            inputMode="email"
                                            value={toUpdateUser.email}
                                            onChange={(e) => {
                                                setToUpdateUser(prevState => ({
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
                                        />
                                    </div>
                                    {/*<div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Téléphone</Typography>
                                        <TextField
                                            type={"text"}
                                            inputMode="tel"
                                            variant="outlined"
                                            value={toUpdateUser.phone}
                                            onChange={(e) => {
                                                setToUpdateUser(prevState => ({
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
                                        />
                                    </div>*/}
                                    <div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Taux horaire</Typography>
                                        <TextField
                                            type={"number"}
                                            variant="outlined"
                                            value={toUpdateUser.price}
                                            onChange={(e) => {
                                                setToUpdateUser(prevState => ({
                                                    ...prevState,
                                                    "price": e.target.value
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
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">CHF/h</InputAdornment>,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                        <MuiButton
                            onClick={() => {
                                setOpenUserModal(false)
                            }}
                            color="primary"
                            variant="outlined"
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton
                            disabled={toUpdateUser.first_name.trim() === "" || toUpdateUser.last_name.trim() === "" ||
                                utilFunctions.verif_Email(toUpdateUser.email) || isNaN(parseFloat(toUpdateUser.price)) || parseFloat(toUpdateUser.price) < 0}
                            onClick={() => {
                                update_user()
                            }}
                            color="primary"
                            variant="contained"
                            size={"medium"}
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Modifier
                        </MuiButton>
                    </DialogActions>
                </Dialog>
            }



            <Modal backdrop={true} role="alertdialog" open={openDeleteModal}
                   onClose={() => {setOpenDeleteModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    <Typography variant="h6" color="primary" style={{fontWeight:700,fontSize:16}}>
                        Supprimer utilisateur
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateUser &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de supprimer&nbsp;<b>{toUpdateUser.last_name + " " + toUpdateUser.first_name}</b>&nbsp;de l'équipe OA
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
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem",backgroundColor:"#D50000"}}
                               onClick={() => {
                                   delete_user()
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>
        </div>
    )}