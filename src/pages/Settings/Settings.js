import React, {useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import Typography from "@mui/material/Typography";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from "@mui/material/Box";
import Project_functions from "../../tools/project_functions";
import {ShimmerTable} from "react-shimmer-effects";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Modal} from "rsuite";
import {toast} from "react-toastify";
import ApiBackService from "../../provider/ApiBackService";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {Button} from "primereact/button";
import AddIcon from "@mui/icons-material/Add";

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

export default function Settings(props) {

    const screenSize = useWindowSize()
    const navigate = useNavigate()

    const [loading, setLoading] = React.useState(false);
    const [banks, setBanks] = React.useState();
    const [tabs, setTabs] = React.useState(0);
    const [openNewBankModal, setOpenNewBankModal] = React.useState(false);
    const [newBankType, setNewBankType] = React.useState(["invoice"]);
    const [newBankInternalName, setNewBankInternalName] = React.useState("");
    const [newBankName, setNewBankName] = React.useState("Raiffeisen, 1290 Versoix");
    const [newBankIban, setNewBankIban] = React.useState("");
    const [newBankClearing, setNewBankClearing] = React.useState("80808");
    const [newBankBic, setNewBankBic] = React.useState("RAIFCH22XXX");
    const [newBankBenef, setNewBankBenef] = React.useState({
        name: "OA Legal SA",
        street: "1, place de Longemalle",
        house_num: "",
        pcode: "1204",
        city: "Geneva",
        country: "CH"
    });
    const [openBankModal, setOpenBankModal] = React.useState(false);
    const [toUpdateBank, setToUpdateBank] = React.useState();
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    useEffect(() => {
        !banks && get_banks()
    }, [])

    const get_banks = async () => {
        let banks = await Project_functions.get_banks({},"",1,50)
        if(banks && banks !== "false"){
            setBanks(banks)
        }else{
            console.error("ERROR GET LIST USERS")
            setTimeout(() => {
                get_banks()
            },10000)
        }
    }

    const add_new_bank = () => {
        setOpenNewBankModal(false)
        setLoading(true)
        let data = {
            internal_name: newBankInternalName,
            name: newBankName,
            iban: newBankIban,
            clearing:newBankClearing,
            bic: newBankBic,
            benef: newBankBenef,
        }
        ApiBackService.add_bank(data).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("L'ajout du nouvelle banque est effectué avec succès !")
                reset_add_modal()
                setBanks()
                get_banks()
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const update_bank = () => {
        setOpenBankModal(false)
        setLoading(true)
        ApiBackService.update_bank(toUpdateBank.id,toUpdateBank).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Modification effectuée avec succès !")
                setToUpdateBank()
                setBanks()
                get_banks()
            }else{
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const delete_bank = () => {
        setOpenDeleteModal(false)
        setLoading(true)
        ApiBackService.delete_bank(toUpdateBank.id).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateBank()
                setBanks()
                get_banks()
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
        setNewBankBenef({
            name: "OA Legal SA",
            street: "1, place de Longemalle",
            house_num: "",
            pcode: "1204",
            city: "Geneva",
            country: "CH"
        })
        setNewBankType(["invoice"])
        setNewBankClearing("80808")
        setNewBankBic("RAIFCH22XXX")
        setNewBankInternalName("")
        setNewBankName("Raiffeisen, 1290 Versoix")
        setNewBankIban("")
    }

    const renderBenefTemplate = (rowData) => {
        return <span style={{color:"#333"}}>{rowData.benef.name}</span>;
    }

    const renderActionsTemplate = (rowData) => {
        return(
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateBank(rowData)
                                setOpenBankModal(true)
                            }}
                >
                    <VisibilityOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateBank(rowData)
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
                                      setBanks()
                                      get_banks()
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
                            <Typography variant="h6" style={{fontWeight:700}} color="primary">Paramètres</Typography>
                        </div>
                        <hr style={{color:"#EDF2F7"}}/>
                        <div>
                            <Tabs value={tabs}
                                  onChange={(e,value) => {
                                      setTabs(value)
                                  }}
                                  variant="scrollable"
                                  allowScrollButtonsMobile={true}
                                  scrollButtons="auto"
                                  aria-label="basic tabs">
                                <Tab label="Banques" {...a11yProps(0)}/>
                                <Tab label="Autres" {...a11yProps(1)}/>
                            </Tabs>
                            <TabPanel value={tabs} index={0}>
                                <div align="right">
                                    <MuiButton variant="contained" color="primary" size="medium"
                                               style={{textTransform: "none", fontWeight: 800,marginTop:-10}}
                                               startIcon={<AddIcon style={{color: "#fff"}}/>}
                                               onClick={() => {
                                                   setOpenNewBankModal(true)
                                               }}
                                    >
                                        Ajouter banque
                                    </MuiButton>
                                </div>
                                <div className="mt-2">
                                    {
                                        !banks ?
                                            <ShimmerTable row={3} col={7} size={"sm"} /> :
                                            <DataTable value={banks}
                                                       paginator
                                                       paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                                       currentPageReportTemplate="Montrant {first} à {last} sur {totalRecords}"
                                                       rows={5} rowsPerPageOptions={[5,10,20,50]}
                                                       paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                                                       onRowClick={(e) => {
                                                           setToUpdateBank(e.data)
                                                           setOpenBankModal(true)
                                                       }}
                                                       rowHover={true}
                                                       selectionMode={"single"}
                                                       style={{border:"1px solid #FOFOFO"}}
                                                       size="small"
                                                       emptyMessage="Aucun résultat trouvé"
                                            >
                                                <Column field="internal_name" header="Titre" style={{color:"#333",fontWeight:700}} ></Column>
                                                <Column field="name" header="Desc (facture)" style={{color:"#333"}}></Column>
                                                <Column field="iban" header="Iban" style={{color:"#333",fontWeight:700}}></Column>
                                                <Column field="clearing" header="Clearing" style={{color:"#333"}}></Column>
                                                <Column field="bic" header="Bic" style={{color:"#333"}}></Column>
                                                <Column header="Bénéficiaire" body={renderBenefTemplate} ></Column>
                                                <Column header="Actions" body={renderActionsTemplate}></Column>
                                            </DataTable>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={tabs} index={1}>

                            </TabPanel>
                        </div>
                    </div>
                </div>
            </div>


            <Dialog
                open={openNewBankModal}
                aria-labelledby="form-dialog-title"
                fullWidth={"md"}
                style={{zIndex: 100}}
            >
                <DialogTitle disableTypography id="form-dialog-title">
                    <Typography variant="h6" color="primary" style={{fontWeight:700}}>Ajouter une nouvelle banque</Typography>
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
                            setOpenNewBankModal(false)
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <hr style={{marginBottom:5,marginTop:15}}/>
                </DialogTitle>
                <DialogContent style={{overflowY: "inherit"}}>
                    <div className="pr-1">
                        <div className="row mt-1">
                            <div className="col-lg-8 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Titre</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankInternalName}
                                    onChange={(e) =>
                                        setNewBankInternalName(e.target.value)
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
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Pour</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankType}
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setNewBankType(e.target.value)
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
                                    SelectProps={{
                                        multiple: true,
                                        value: newBankType,
                                        onChange: (e) => {
                                            console.log(e.target.value)
                                            setNewBankType(e.target.value)
                                        }
                                    }}
                                >
                                    <MenuItem value={"invoice"}>Facture</MenuItem>
                                    <MenuItem value={"provision"}>Provision</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-lg-12 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Desc (facture)</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankName}
                                    onChange={(e) =>
                                        setNewBankName(e.target.value)
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
                            <div className="col-lg-12 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Bénéficiaire</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankBenef.name}
                                    onChange={(e) => {
                                        setNewBankBenef(prevState => ({
                                            ...prevState,
                                            "name": e.target.value
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
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Iban</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankIban}
                                    onChange={(e) =>
                                        setNewBankIban(e.target.value)
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
                            <div className="col-lg-3 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>BIC</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankBic}
                                    onChange={(e) =>
                                        setNewBankBic(e.target.value)
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
                            <div className="col-lg-3 mb-1">
                                <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Clearing</Typography>
                                <TextField
                                    type={"text"}
                                    variant="outlined"
                                    value={newBankClearing}
                                    onChange={(e) =>
                                        setNewBankClearing(e.target.value)
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
                </DialogContent>
                <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                    <MuiButton
                        onClick={() => {
                            reset_add_modal()
                            setOpenNewBankModal(false)
                        }}
                        color="primary"
                        variant="outlined"
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton
                        disabled={newBankName.trim() === "" || newBankInternalName.trim() === "" ||
                            newBankClearing.trim() === "" || newBankBic.trim() === "" || newBankIban.trim() === ""}
                        onClick={() => {
                            add_new_bank()
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
                toUpdateBank &&
                <Dialog
                    open={openBankModal}
                    aria-labelledby="form-dialog-title"
                    fullWidth={"md"}
                    style={{zIndex: 100}}

                >
                    <DialogTitle disableTypography id="form-dialog-title">
                        <Typography variant="h6" color="primary" style={{fontWeight:700}} >Modifier banque</Typography>
                        <IconButton
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 5,
                                top: 5,
                                color: '#000'
                            }}
                            onClick={() => {
                                setOpenBankModal(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <hr style={{marginBottom:5,marginTop:15}}/>
                    </DialogTitle>
                    <DialogContent style={{overflowY: "inherit"}}>
                        <div className="pl-1 pr-1 mt-2">
                            <div>
                                <div className="row mt-2">
                                    <div className="col-lg-8 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Titre</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.internal_name || ""}
                                            onChange={(e) => {
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "internal_name": e.target.value
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
                                    <div className="col-lg-4 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Pour</Typography>
                                        <TextField
                                            select
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.type || []}
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                setToUpdateBank(prevState => ({
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
                                            SelectProps={{
                                                multiple: true,
                                                value: toUpdateBank.type || [],
                                                onChange: (e) => {
                                                    console.log(e.target.value)
                                                    setToUpdateBank(prevState => ({
                                                        ...prevState,
                                                        "type": e.target.value
                                                    }))
                                                }
                                            }}
                                        >
                                            <MenuItem value={"invoice"}>Facture</MenuItem>
                                            <MenuItem value={"provision"}>Provision</MenuItem>
                                        </TextField>
                                    </div>
                                    <div className="col-lg-12 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Desc (facture)</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.name || ""}
                                            onChange={(e) => {
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "name": e.target.value
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
                                    <div className="col-lg-12 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Bénéficiaire</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.benef ? (toUpdateBank.benef.name || "") : ""}
                                            onChange={(e) => {
                                                let benef = toUpdateBank.benef
                                                benef.name = e.target.value
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "benef": benef
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
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Iban</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.iban || ""}
                                            onChange={(e) => {
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "iban": e.target.value
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
                                    <div className="col-lg-3 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>BIC</Typography>
                                        <TextField
                                            type={"text"}
                                            variant="outlined"
                                            value={toUpdateBank.bic || ""}
                                            onChange={(e) => {
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "bic": e.target.value
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
                                    <div className="col-lg-3 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize:14,color:"#616161"}}>Clearing</Typography>
                                        <TextField
                                            type={"number"}
                                            variant="outlined"
                                            value={toUpdateBank.clearing || ""}
                                            onChange={(e) => {
                                                setToUpdateBank(prevState => ({
                                                    ...prevState,
                                                    "clearing": e.target.value
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
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                        <MuiButton
                            onClick={() => {
                                setOpenBankModal(false)
                            }}
                            color="primary"
                            variant="outlined"
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton
                            disabled={toUpdateBank.name.trim() === "" || toUpdateBank.internal_name.trim() === "" ||
                                toUpdateBank.clearing.trim() === "" || toUpdateBank.bic.trim() === "" || toUpdateBank.iban.trim() === ""}
                            onClick={() => {
                                update_bank()
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
                        Supprimer banque
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateBank &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de supprimer cette banque
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
                                   delete_bank()
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>

        </div>
    )
}