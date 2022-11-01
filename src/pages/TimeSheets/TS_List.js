import React,{useEffect} from "react";
import useWindowSize from "../../components/WindowSize/useWindowSize";
import {useNavigate} from "react-router-dom";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import {
    Button as MuiButton,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    Avatar,
    Select as MuiSelect
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {alphabet, timeSuggestions} from "../../data/data";
import Box from "@mui/material/Box";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Project_functions from "../../tools/project_functions";
import {toast} from "react-toastify";
import userAvatar from "../../assets/images/default_avatar.png";
import projectFunctions from "../../tools/project_functions";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InputAdornment from "@mui/material/InputAdornment";
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import { Paginator } from 'primereact/paginator';
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {ShimmerCircularImage, ShimmerTable, ShimmerTitle} from "react-shimmer-effects";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ApiBackService from "../../provider/ApiBackService";
import utilFunctions from "../../tools/functions";
import RenderUserAvatar from "../../components/Avatars/UserAvatar";
import AtlButton, { ButtonGroup as AltButtonGroup } from '@atlaskit/button';
import Select from '@atlaskit/select';
import CheckIcon from '@mui/icons-material/Check';
import { Dropdown } from 'primereact/dropdown';
import { DatePicker } from '@atlaskit/datetime-picker';
import CloseIcon from "@mui/icons-material/Close";
import {Modal} from "rsuite";
import groupBy from 'lodash/groupBy'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AvatarGroup } from 'primereact/avatargroup';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import OutlinedInput from '@mui/material/OutlinedInput';
import _ from "lodash"

import RenderUserAvatarImage from "../../components/Avatars/UserAvatarImage";

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    trim:true,
    stringify: (option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : "")),
});
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

const tsTableTemplate = {
    layout: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
    'CurrentPageReport': (options) => {
        return (
            <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} sur {options.totalRecords}
                </span>
        )
    },
    'RowsPerPageDropdown': (options) => {
        const dropdownOptions = [
            { label: 5, value: 5 },
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 50, value: 50 },
            { label: 'Tous', value: options.totalRecords }
        ];

        return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
    }
};
const factTableTemplate = {
    layout: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
    'CurrentPageReport': (options) => {
        return (
            <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} sur {options.totalRecords}
                </span>
        )
    },
    'RowsPerPageDropdown': (options) => {
        const dropdownOptions = [
            { label: 5, value: 5 },
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 50, value: 50 },
            { label: 'Tous', value: options.totalRecords }
        ];

        return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
    }
};

export default function TS_List(props) {


    const screenSize = useWindowSize()
    const navigate = useNavigate()


    const [loading, setLoading] = React.useState(false);
    const [updateScreen, setUpdateScreen] = React.useState(false);

    const [tabs, setTabs] = React.useState(0);
    const [clients, setClients] = React.useState();
    const [client_folders, setClient_folders] = React.useState();
    const [update_client_folders, setUpdate_client_folders] = React.useState();
    const [oa_users, setOa_users] = React.useState();

    const [selectedDate, setSelectedDate] = React.useState(moment());
    const [showSearchForm, setShowSearchForm] = React.useState(true);
    const [tm_client_search, setTm_client_search] = React.useState("");
    const [tm_client_folder_search, setTm_client_folder_search] = React.useState("");
    const [tm_user_search, setTm_user_search] = React.useState("");
    const [tm_sdate_search, setTm_sdate_search] = React.useState();
    const [tm_edate_search, setTm_edate_search] = React.useState();

    const [newTimeSheet, setNewTimeSheet] = React.useState({
        type:0,
        duration:"",
        desc:"",
        date:moment().format("YYYY-MM-DD HH:mm"),
        client:"",
        cl_folder:"",
        user:"",
        user_price:"",
        prov_amount:"",
        prov_bank:"",
        prov_tax:""
    });
    const [toUpdateTs, setToUpdateTs] = React.useState();
    const [toUpdateTsCopy, setToUpdateTsCopy] = React.useState();
    const [openTsModal, setOpenTsModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openDeleteFactModal, setOpenDeleteFactModal] = React.useState(false);


    const [tsTableFirst, setTsTableFirst] = React.useState(0);
    const [tsTablePage, setTsTablePage] = React.useState(1);
    const [tsTableRows, setTsTableRows] = React.useState(5);
    const [tsTableTotal, setTsTableTotal] = React.useState(5);

    const [timesheets, setTimesheets] = React.useState();
    const [ts_selected_rows, setTs_selected_rows] = React.useState();
    const [showBy, setShowBy] = React.useState({ label: 'Par TimeSheet', value: 'timesheet' });
    const [expandedTsByFolderRows, setExpandedTsByFolderRows] = React.useState();
    const [partnerValidation, setPartnerValidation] = React.useState("");
    const [invoice_date, setInvoice_date] = React.useState(moment().format("YYYY-MM-DD HH:mm"));

    const [invoices, setInvoices] = React.useState();
    const [toUpdateFact, setToUpdateFact] = React.useState();
    const [showSearchFactForm, setShowSearchFactForm] = React.useState(true);
    const [inv_search_status, setInv_search_status] = React.useState(-1);
    const [inv_search_user, setInv_search_user] = React.useState("");
    const [inv_search_client, setInv_search_client] = React.useState("");
    const [inv_search_client_folder, setInv_search_client_folder] = React.useState("");
    const [inv_search_date1, setInv_search_date1] = React.useState("");
    const [inv_search_date2, setInv_search_date2] = React.useState("");
    const [fact_client_folders, setFact_client_folders] = React.useState("");

    const [factTableFirst, setFactTableFirst] = React.useState(0);
    const [factTablePage, setFactTablePage] = React.useState(1);
    const [factTableRows, setFactTableRows] = React.useState(5);
    const [factTableTotal, setFactTableTotal] = React.useState(5);
    const [expandedFactRows, setexpandedFactRows] = React.useState();
    const [draft_invoice_template, setDraft_invoice_template] = React.useState("");
    const [draft_invoice_bank, setDraft_invoice_bank] = React.useState("");
    const [draft_invoice_paym_condition, setDraft_invoice_paym_condition] = React.useState("");
    const [draft_invoice_taxe, setDraft_invoice_taxe] = React.useState("");
    const [draft_invoice_fraisAdmin, setDraft_invoice_fraisAdmin] = React.useState("");
    const [draft_invoice_reduction_type, setDraft_invoice_reduction_type] = React.useState("percent");
    const [draft_invoice_reduction, setDraft_invoice_reduction] = React.useState("");

    const onTsTablePageChange = (event) => {
        setTsTableFirst(event.first);
        setTsTableRows(event.rows);
        setTsTablePage(event.page + 1)
        /*get_timesheets(event.page + 1,event.rows)*/
        filter_timesheets(event.page + 1,event.rows,tm_user_search.id || "false",tm_client_search.id || "false",
            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
            "false","false")
    }
    const onFactTablePageChange = (event) => {
        setFactTableFirst(event.first);
        setFactTableRows(event.rows);
        setFactTablePage(event.page + 1)
        /*get_timesheets(event.page + 1,event.rows)*/
        filter_invoices(event.page + 1,event.rows,inv_search_user.id || "false",inv_search_client.id || "false",
            inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
            "false","false")
    }

    useEffect(() => {
        !timesheets &&
        filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
            "false","false")
        !clients && get_clients()
        !oa_users && get_oa_users()
        !invoices &&
        filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
            inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
            "false","false")
    }, [])

    useEffect(() => {
        if(selectedDate === ""){
            console.log("11")
            filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                "false","false")
        }else{
            filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                moment(selectedDate).set({hour:23,minute:59,second:59}).unix(),moment(selectedDate).set({hour:0,minute:0,second:1}).unix())
        }
    }, [selectedDate])

    const groupedTsByFolder = groupBy(timesheets || [], function(n) {
        return n.client_folder.id
    });
    let groupedFormatedTsByFolder = Object.values(groupedTsByFolder);

    const filter_timesheets = (page,number,user,client,client_folder,l_date,g_date,verif_inputs) => {
        setLoading(true)
        let filter = {}
        let less = {}
        let greater = {}
        if(user && user !== "false") filter.user = user
        if(client && client !== "false") filter = {...filter,client:{id:client}}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:{id:client_folder}}

        if(l_date && l_date !== "false"){
            less.field = "date"
            less.value = l_date
        }else{
            if(selectedDate === ""){
                if(tm_edate_search && tm_edate_search !== "" && verif_inputs === "true"){
                    less.field = "date"
                    less.value = moment(tm_edate_search).set({hour:23,minute:59,second:59}).unix()
                }
            }else{
                less.field = "date"
                less.value = moment(selectedDate).set({hour:23,minute:59,second:59}).unix()
            }
        }
        if(g_date && g_date !== "false"){
            greater.field = "date"
            greater.value = g_date
        }else{
            if(selectedDate === ""){
                if(tm_sdate_search && tm_sdate_search !== "" && verif_inputs === "true"){
                    greater.field = "date"
                    greater.value = moment(tm_sdate_search).set({hour:0,minute:0,second:0}).unix()
                }
            }else{
                greater.field = "date"
                greater.value = moment(selectedDate).set({hour:0,minute:0,second:0}).unix()
            }
        }
        ApiBackService.get_all_timesheets({filter:filter,exclude: "",less:less,greater:greater},page,number).then( res => {
            console.log(res)
            if(res.status === 200 && res.succes === true){
                setTsTableTotal(res.data.pagination.total)
                setTimesheets(res.data.list)
                setLoading(false)
            }else{
                setLoading(false)
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
        }).catch( err => {setLoading(false)
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
        })
    }

    const filter_invoices = (page,number,user,client,client_folder,l_date,g_date,verif_inputs) => {
        setLoading(true)
        let filter = {}
        let less = {}
        let greater = {}
        if(user && user !== "false") filter.user = user
        if(client && client !== "false") filter = {...filter,client:{id:client}}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:{id:client_folder}}

        if(l_date && l_date !== "false"){
            less.field = "date"
            less.value = l_date
        }else{
            if(inv_search_date2 && inv_search_date2 !== "" && verif_inputs === "true"){
                less.field = "date"
                less.value = moment(inv_search_date2).set({hour:23,minute:59,second:59}).unix()
            }
        }
        if(g_date && g_date !== "false"){
            greater.field = "date"
            greater.value = g_date
        }else{
            if(inv_search_date1 && inv_search_date1 !== "" && verif_inputs === "true"){
                greater.field = "date"
                greater.value = moment(inv_search_date1).set({hour:0,minute:0,second:0}).unix()
            }
        }
        console.log(filter)
        console.log(less)
        console.log(greater)
        ApiBackService.get_invoices({filter:filter,exclude: "",less:less,greater:greater},page,number).then( res => {
            console.log(res)
            if(res.status === 200 && res.succes === true){
                setFactTableTotal(res.data.pagination.total)
                setInvoices(res.data.list)
                setLoading(false)
            }else{
                setLoading(false)
                toast.warn(res.error || "Une erreur est survenue, veuillez recharger  la page")
            }
        }).catch( err => {setLoading(false)
            toast.warn("Une erreur est survenue, veuillez recharger  la page")
        })
    }

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
            },30000)
        }
    }

    const get_client_folders = async (client_id,updateFirst) => {
        let client_folders = await Project_functions.get_client_folders(client_id,{},"",1,50)
        if(client_folders && client_folders !== "false"){
            setClient_folders(client_folders)
            if(updateFirst && updateFirst === "search"){
                setTm_client_folder_search(client_folders.length > 0 ? client_folders[0] : "")
                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",
                    client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")
            }
            if(updateFirst && updateFirst === "search_fact"){
                setInv_search_client_folder(client_folders.length > 0 ? client_folders[0] : "")
                /*filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",
                    client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")*/
            }
            updateFirst && updateFirst === "newTs" && client_folders.length > 0 &&
            setNewTimeSheet(prevState => ({
                ...prevState,
                "cl_folder": client_folders[0]
            }))

        }else{
            console.error("ERROR GET LIST CLIENTS FOLDERS")
        }
    }

    const get_fact_client_folders = async (client_id,updateFirst) => {
        let client_folders = await Project_functions.get_client_folders(client_id,{},"",1,50)
        if(client_folders && client_folders !== "false"){
            setFact_client_folders(client_folders)
            if(updateFirst && updateFirst === "search_fact"){
                //setInv_search_client_folder(client_folders.length > 0 ? client_folders[0] : "")
                filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                    client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")
            }
        }else{
            console.error("ERROR GET LIST CLIENTS FOLDERS")
        }
    }

    const get_update_client_folders = async (client_id) => {
        console.log(client_id)
        setLoading(true)
        let update_client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(update_client_folders && update_client_folders !== "false"){
            setUpdate_client_folders(update_client_folders)
            setLoading(false)
            setOpenTsModal(true)
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const get_update_client_folders_after = async (client_id) => {
        let update_client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(update_client_folders && update_client_folders !== "false"){
            setUpdate_client_folders(update_client_folders)
            setToUpdateTs(prevState => ({
                ...prevState,
                "client_folder": {id:update_client_folders.length > 0 ? update_client_folders[0].id.split("/").pop() : "",
                    name:update_client_folders.length > 0 ? update_client_folders[0].name : ""}
            }))
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
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
            },30000)
        }
    }

    const clear_search_form = () => {
        setTm_sdate_search("")
        setTm_edate_search("")
        setTm_client_search("")
        setTm_client_folder_search("")
        setClient_folders()
        setTm_user_search("")
    }

    const clear_search_fact_form = () => {
        setInv_search_client("")
        setInv_search_client_folder("")
        setInv_search_user("")
        setInv_search_status("")
        /*setInv_search_date1("")
        setInv_search_date2("")*/
    }

    const add_new_ts = (duplicate) => {
        setLoading(true)
        let folder_id_array = newTimeSheet.cl_folder.id.split("/")
        let folder_id = folder_id_array[1]
        let newItem = {
            date:moment(newTimeSheet.date).unix(),
            type:newTimeSheet.type,
            client:{
                id:newTimeSheet.client.id,
                name:projectFunctions.get_client_title(newTimeSheet.client),
            },
            client_folder:{
                id:folder_id,
                name:newTimeSheet.cl_folder.name
            },
            user:newTimeSheet.user.id,
            desc:newTimeSheet.desc,
            duration:utilFunctions.durationToNumber(newTimeSheet.duration),
            price:newTimeSheet.user_price
        }
        console.log(newTimeSheet)
        ApiBackService.add_ts(newItem.client.id,newItem.client_folder.id,newItem).then( res => {
            if(res.status === 200 && res.succes === true){
                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                toast.success("L'ajout du nouveau timeSheet est effectué avec succès !")
                !duplicate && clear_add_ts_form()
                setLoading(false)
            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch( err => {
            console.log(err)
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const update_ts = () => {
        setOpenTsModal(false)
        setLoading(true)
        toUpdateTs.duration = utilFunctions.durationToNumber(toUpdateTs.duration)
        let id_array = toUpdateTs.id.split("/")
        let ts_id = id_array[2]

        ApiBackService.delete_ts(toUpdateTsCopy.client.id,toUpdateTsCopy.client_folder.id,ts_id).then( res => {
            if(res.status === 200 && res.succes === true){

                ApiBackService.add_ts(toUpdateTs.client.id,toUpdateTs.client_folder.id,toUpdateTs).then( res => {
                    if(res.status === 200 && res.succes === true){
                        toast.success("Modification effectuée avec succès !")
                        setToUpdateTs()
                        filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                    }else{
                        toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                        setLoading(false)
                    }
                }).catch( err => {
                    console.log(err)
                    toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                    setLoading(false)
                })

                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",
                    tm_client_search.id || "false",tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                )
            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const delete_ts = () => {
        setOpenDeleteModal(false)
        setLoading(true)
        let id_array = toUpdateTs.id.split("/")
        let ts_id = id_array[2]
        console.log(toUpdateTs)
        ApiBackService.delete_ts(toUpdateTs.client.id,toUpdateTs.client_folder.id,ts_id).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateTs()
                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",
                    tm_client_search.id || "false",tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                )
            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const delete_fact = () => {
        setOpenDeleteFactModal(false)
        setLoading(true)
        console.log(toUpdateFact)
        ApiBackService.delete_invoice(toUpdateFact.id.split("/").shift(),toUpdateFact.id.split("/")[1],toUpdateFact.id.split("/").pop()).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateFact()
                filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                    inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                )
            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
            setLoading(false)
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const clear_add_ts_form = () => {
        setNewTimeSheet({
            type:newTimeSheet.type,
            duration:"",
            desc:"",
            date:moment().format("YYYY-MM-DD HH:mm"),
            client:"",
            cl_folder:"",
            user:"",
            user_price:"",
            prov_bank: "",
            prov_tax: "",
            prov_amount: ""
        })
    }

    const create_invoice = (type,tva,partner,date,timesheets,lang,prov_client,prov_client_folder,prov_amount,prov_bank) => {
        setLoading(true)
        let client_id = type === "invoice" ? timesheets[0].client.id : prov_client.id
        let folder_id = type === "invoice" ? timesheets[0].client_folder.id : prov_client_folder.id.split("/").pop()
        let data = {}
        if(type === "invoice"){
            data = {
                date:moment(date).unix(),
                type: type,
                TVA: tva,
                TVA_inc: false,
                timesheet: timesheets.map( item => {return item.id.split("/").pop()}),
                lang: lang,
                client:{id:timesheets[0].client.id,name:timesheets[0].client.name},
                client_folder:{id:timesheets[0].client_folder.id,name:timesheets[0].client_folder.name},
                user:partner.id
            }
        }
        else if(type === "provision"){
            data = {
                date:moment(date).unix(),
                type: type,
                TVA: tva,
                TVA_inc: false,
                lang: lang,
                client:{id:prov_client.id,name:projectFunctions.get_client_title(prov_client)},
                client_folder:{id:prov_client_folder.id.split("/").pop(),name:prov_client_folder.name},
                prov_amount:parseFloat(prov_amount),
                prov_bank:prov_bank
            }
        }
        ApiBackService.create_invoice(client_id,folder_id,data).then( res => {
            if(res.status === 200 && res.succes === true){
                if(type === "invoice"){
                    setTs_selected_rows()
                    setPartnerValidation("")
                    setInvoice_date("")
                    clear_search_form()
                    setShowBy({ label: 'Par TimeSheet', value: 'timesheet' })
                    toast.success("La création de la facture pour le client " + data.client.name + " - " + data.client_folder.name + " est effectuée avec succès !")
                    setTimeout(() => {
                        setTabs(2)
                    },250)

                }else{
                    clear_add_ts_form()
                    toast.success("La création de la provision pour le client " + data.client.name + " - " + data.client_folder.name + " est effectuée avec succès !")
                }
                filter_timesheets(1,tsTableRows,"false","false", "false")
                setLoading(false)

            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }


    const renderDateTemplate = (rowData) => {
        return (
            <Typography color="black">{rowData.date ? moment.unix(rowData.date).format("DD/MM/YYYY") : ""}</Typography>
        );
    }

    const renderClientFolderTemplate = (rowData) => {
        return (
            <Typography color="black">{rowData.client ? (rowData.client.name + " - " + rowData.client_folder.name) : ""}</Typography>
        );
    }
    const renderUserTemplate = (rowData) => {
        return (
            rowData.user ? <RenderUserAvatar user_id={rowData.user}/> : null
        );
    }
    const renderPriceTemplate = (rowData) => {
        return (
            <Typography color="black">{rowData.price ? ((rowData.price || 0) + " CHF/h") : ""}</Typography>
        );
    }
    const renderDurationTemplate = (rowData) => {
        return (
            <Typography color="black">{rowData.duration ? utilFunctions.formatDuration((rowData.duration || 0).toString()) : ""}</Typography>
        );
    }
    const renderTotalTemplate = (rowData) => {
        return (
            rowData ?
                <span className={"custom-tag status-new"}>{((rowData.duration || 0) * (rowData.price || 0)).toFixed(2)}&nbsp;CHF</span> :
                null
        );
    }

    const renderActionsTemplate = (rowData) => {
        return (
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let ts_copy = _.cloneDeep(rowData)
                                setToUpdateTsCopy(ts_copy)
                                setToUpdateTs(prevState => ({
                                    ...rowData,
                                    "duration": utilFunctions.formatDuration(rowData.duration.toString())
                                }))
                                get_update_client_folders(rowData.client.id)
                            }}
                >
                    <EditOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateTs(rowData)
                                setOpenDeleteModal(true)
                            }}
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        )
    }

    const renderByFolderActionsTemplate = (rowData) => {
        return (
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                >
                    <EditOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        )
    }

    const renderClientTemplate = (rowData) => {
        return(
            <Typography>{rowData[0].client.name}</Typography>
        );
    }
    const renderFolderTemplate = (rowData) => {
        return(
            <Typography>{rowData[0].client_folder.name}</Typography>
        );
    }
    const RenderAssociesTemplate = (rowData) => {
        const [folder, setFolder] = React.useState();
        useEffect(() => {
            if(!folder){
                ApiBackService.get_client_folder_details(rowData[0].client.id,rowData[0].client_folder.id).then( res => {
                    if(res.status === 200 && res.succes === true){
                        setFolder(res.data)
                    }
                }).catch( err => {
                    console.log(err)
                })
            }
        }, [])
        return(
            !folder ?
                <div style={{display:"flex"}}>
                    <div style={{alignSelf:"center",marginLeft:5}}>
                        <ShimmerCircularImage size={30} />
                    </div>
                    <div style={{alignSelf:"center",marginLeft:5}}>
                        <ShimmerCircularImage size={30} />
                    </div>
                    <div style={{alignSelf:"center",marginLeft:5}}>
                        <ShimmerCircularImage size={30} />
                    </div>
                </div> :
                <div>
                    <AvatarGroup max={3}>
                        {
                            (folder.associate || []).map( item => (
                                <RenderUserAvatarImage user_id={item.id} size={35}/>
                            ))
                        }
                    </AvatarGroup>
                </div>
        );
    }

    const RenderUserInChargeTemplate = (rowData) => {
        const [folder, setFolder] = React.useState();
        useEffect(() => {
            if(!folder){
                ApiBackService.get_client_folder_details(rowData[0].client.id,rowData[0].client_folder.id).then( res => {
                    if(res.status === 200 && res.succes === true){
                        setFolder(res.data)
                    }
                }).catch( err => {
                    console.log(err)
                })
            }
        }, [])
        return(
            !folder ?
                <div style={{display:"flex"}}>
                    <div style={{alignSelf:"center"}}>
                        <ShimmerCircularImage size={35} />
                    </div>
                    <div style={{marginLeft:10,width:110,alignSelf:"center"}}>
                        <ShimmerTitle line={1} gap={10} variant="secondary" />
                    </div>

                </div> :
                <div>
                    <RenderUserAvatar user_id={folder.user_in_charge}/>
                </div>
        );
    }
    const renderTotalHoursTemplate = (rowData) => {
        let total_hours = 0
        rowData.map( item => {
            total_hours = total_hours + item.duration
        })
        return(
            <Typography>{utilFunctions.formatDuration(total_hours.toString())}</Typography>
        );
    }
    const renderTotalPriceTemplate = (rowData) => {
        let total_price = 0
        rowData.map( item => {
            total_price = total_price + ((item.duration || 0) * (item.price || 0))
        })
        return(
            <span className={"custom-tag status-new"}>{total_price}&nbsp;CHF</span>
        );
    }

    const rowExpansionTemplate = (data) => {
        console.log(data)
        return (
            <div className="tsByFolders-subtable">
                <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700,textDecoration:"underline"}}>
                    {data.length} timesheet non encore facturés</Typography>
                <div className="mt-2">
                    <DataTable value={data} responsiveLayout="scroll" rowHover={true} style={{borderColor:"#EDF2F7",borderWidth:2,minHeight:"unset"}}>
                        <Column header="Date" body={renderDateTemplate}></Column>
                        <Column field="desc" header="Description" style={{color:"black"}}></Column>
                        <Column header="Utilisateur" body={renderUserTemplate}></Column>
                        <Column header="Taux horaire" body={renderPriceTemplate}></Column>
                        <Column header="Durée" body={renderDurationTemplate}></Column>
                        <Column header="Total" body={renderTotalTemplate}></Column>
                    </DataTable>
                    {renderConfirmInvoiceForm()}
                </div>

            </div>
        );
    }

    const renderConfirmInvoiceForm = () => {
        return(
            <div className="mt-4">
                <div className="row ml-1">
                    <div className="col-lg-6 mb-1">
                        <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700}}>
                            Partner validant cette facture
                        </Typography>
                        <Autocomplete
                            style={{width:"100%"}}
                            autoComplete={false}
                            autoHighlight={false}
                            size="small"
                            options={oa_users || []}
                            loading={!oa_users}
                            loadingText="Chargement en cours..."
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
                            value={partnerValidation || ""}
                            onChange={(event, value) => {
                                if(value){
                                    setPartnerValidation(value)
                                }else{
                                    setPartnerValidation("")
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant={"outlined"}
                                    value={partnerValidation || ""}
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
                        <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700}}>
                            Date de la facture
                        </Typography>
                        <TextField
                            type={"datetime-local"}
                            variant="outlined"
                            value={invoice_date}
                            onChange={(e) =>{
                                setInvoice_date(e.target.value)
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
                <div align="right" className="mt-2">
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{textTransform: "none", fontWeight: 800}}
                               disabled={partnerValidation === "" || invoice_date === ""}
                               onClick={() => {
                                   create_invoice("invoice",7.7,partnerValidation,invoice_date,ts_selected_rows,"fr")
                               }}
                    >
                        Envoyer facture pour validation
                    </MuiButton>
                </div>
            </div>
        )
    }


    const renderFactTypeTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-info"}>{rowData.type === "invoice" ? "Facture" : "Provision"}</span>
        );
    }
    const renderFactDateTemplate = (rowData) => {
        return(
            <Typography>{rowData.date ? moment.unix(rowData.date).format("DD-MM-YYYY") : ""}</Typography>
        );
    }
    const RenderFactClientTemplate = (rowData) => {
        return(
            <Typography>{rowData.client ? rowData.client.name : ""}</Typography>
        );
    }
    const renderFactFolderTemplate = (rowData) => {
        return(
            <Typography>{rowData.client_folder ? rowData.client_folder.name : ""}</Typography>
        );
    }
    const renderFactTotatHtTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-info"}>{rowData.price ? (rowData.price.HT.toFixed(2) + " CHF") : ""}</span>
        );
    }
    const renderFactTaxeTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-danger"}>{rowData.price ? (rowData.price.taxes.toFixed(2) + " CHF") : ""}</span>
        );
    }
    const renderFactTotalTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-new"}>{rowData.price ? (rowData.price.total.toFixed(2) + " CHF") : ""}</span>
        );
    }
    const renderFactStatusTemplate = (rowData) => {
        return(
            rowData.status === 0 && rowData.type === "invoice" ?
                <span className={"custom-tag status-warning"}>{"En attente"}</span> :
                <span className={"custom-tag status-success"}>{"Validé"}</span>
        );
    }
    const renderFactPaymentTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-info"}>{rowData.status === 3 ? "Payé" : "Non payé"}</span>
        );
    }
    const allowFactExpansion = (rowData) => {
        return rowData.timesheet && rowData.timesheet.length > 0 ;
    };

    const renderFactActionsTemplate = (rowData) => {
        return (
            <React.Fragment>
                <IconButton title="Modifier" color="default" size="small"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                >
                    <EditOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setToUpdateFact(rowData)
                                setOpenDeleteFactModal(true)
                            }}
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        )
    }

    const rowExpansionFactTemplate = (data) => {

        return (
            <div className="tsByFolders-subtable">
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700,textDecoration:"underline",alignSelf:"center"}}>
                        {(data.timesheet || []).length} timesheet</Typography>
                    <div style={{alignSelf:"center"}}>
                        <MuiButton color="primary"
                                   onClick={() => {
                                   }}
                                   startIcon={<AddIcon/>}
                                   style={{fontWeight:700,alignSelf:"center",textTransform:"none"}}
                        >Ajouter un timesheet
                        </MuiButton>
                    </div>
                </div>

                <div className="mt-2">
                    <DataTable value={data.timesheet || []} responsiveLayout="scroll" rowHover={true}
                               style={{borderColor:"#EDF2F7",borderWidth:2,minHeight:"unset"}}
                    >
                                <Column header="Actions" body={renderByFolderActionsTemplate} align="center"></Column>
                                <Column header="Date" body={renderDateTemplate} align="center"></Column>
                                <Column field="desc" header="Description" style={{color:"black"}}></Column>
                                <Column header="Utilisateur" body={renderUserTemplate}></Column>
                                <Column header="Taux horaire" body={renderPriceTemplate} align="center"></Column>
                                <Column header="Durée" body={renderDurationTemplate} align="center"></Column>
                                <Column header="Total" body={renderTotalTemplate} align="center"></Column>
                    </DataTable>
                    <div className="mt-3 ml-2 mr-2">
                        <div className="row">
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Choix du template</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={draft_invoice_template}
                                    onChange={(e) =>{
                                        setDraft_invoice_template(e.target.value)
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
                                    <MenuItem value={1}>Date seulement</MenuItem>
                                    <MenuItem value={2}>Date + Description</MenuItem>
                                    <MenuItem value={3}>Date + Nom avocat</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Compte bancaire</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={draft_invoice_bank}
                                    onChange={(e) =>{
                                        setDraft_invoice_bank(e.target.value)
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
                                    <MenuItem value={1}>Compte exploitation CHF</MenuItem>
                                    <MenuItem value={2}>Compte exploitation EURO</MenuItem>
                                    <MenuItem value={3}>Compte avoir clients</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Conditions de paiement</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={draft_invoice_paym_condition}
                                    onChange={(e) =>{
                                        setDraft_invoice_paym_condition(e.target.value)
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
                                    <MenuItem value={1}>15 jours</MenuItem>
                                    <MenuItem value={2}>30 jours net</MenuItem>
                                    <MenuItem value={3}>45 jours</MenuItem>
                                </TextField>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Taxe</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={draft_invoice_taxe}
                                    onChange={(e) =>{
                                        setDraft_invoice_taxe(e.target.value)
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
                                    <MenuItem value={1}>TVA due à 7.7% (TN)</MenuItem>
                                    <MenuItem value={2}>TVA 0% exclue</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Frais administratifs</Typography>
                                <TextField
                                    select
                                    type={"text"}
                                    variant="outlined"
                                    value={draft_invoice_bank}
                                    onChange={(e) =>{
                                        setDraft_invoice_bank(e.target.value)
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
                                    <MenuItem value={1}>2%</MenuItem>
                                    <MenuItem value={2}>Aucun</MenuItem>
                                </TextField>
                            </div>
                            <div className="col-lg-4 mb-1">
                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Réduction</Typography>
                                <OutlinedInput
                                    id="outlined-adornment"
                                    type={"text"}
                                    value={draft_invoice_reduction}
                                    style={{width: "100%"}}
                                    onChange={(e) =>{
                                        setDraft_invoice_reduction(e.target.value)
                                    }}
                                    size="small"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <MuiSelect value={draft_invoice_reduction_type}
                                                       onChange={(e) =>{
                                                           setDraft_invoice_reduction_type(e.target.value)
                                                       }}
                                                       variant="standard" disableUnderline={true}
                                            >
                                                <MenuItem key="0" value="percent">
                                                    %
                                                </MenuItem>
                                                <MenuItem key="1" value="fix">
                                                    CHF
                                                </MenuItem>
                                            </MuiSelect>
                                        </InputAdornment>
                                    }
                                />
                            </div>
                        </div>
                        <div style={{display:"flex",justifyContent:"right"}} className="mt-2">
                            <MuiButton variant="outlined" color="primary" size="medium"
                                       style={{textTransform: "none", fontWeight: 800}}
                                       onClick={() => {

                                       }}
                            >
                                Preview
                            </MuiButton>
                            <MuiButton variant="contained" color="primary" size="medium"
                                       style={{textTransform: "none", fontWeight: 800,marginLeft:15}}
                                       onClick={() => {

                                       }}
                            >
                                Valider la facture
                            </MuiButton>
                        </div>
                    </div>
                </div>

            </div>
        );
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
                                  onChange={(e,value) => {
                                      if(value === 1){
                                          /*filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                              tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")*/
                                      }
                                      setTabs(value)
                                  }}
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
                                            {/*reste*/}
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Date</Typography>
                                                <TextField
                                                    type={"datetime-local"}
                                                    variant="outlined"
                                                    value={newTimeSheet.date}
                                                    onChange={(e) =>{
                                                        console.log(e.target.value)
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
                                                    inputProps={{
                                                        max:moment().format("YYYY-MM-DD HH:mm")
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {
                                            newTimeSheet.type === 0 &&
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
                                                        value={newTimeSheet.duration || ""}
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
                                                                error={newTimeSheet.duration !== "" && !utilFunctions.verif_duration(newTimeSheet.duration)}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                                    placeholder:"Format: --h--",
                                                                    onChange:(e) => {
                                                                        console.log(e.target.value)
                                                                        setNewTimeSheet(prevState => ({
                                                                            ...prevState,
                                                                            "duration": e.target.value
                                                                        }))
                                                                    }
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
                                                    {
                                                        newTimeSheet.duration !== "" && !utilFunctions.verif_duration(newTimeSheet.duration) &&
                                                        <Typography variant="subtitle1" color="error">Format invalide, Veuillez utiliser le format --h--</Typography>
                                                    }
                                                </div>
                                            </div>
                                        }

                                        {/*reste*/}
                                        <div className="row mt-1">
                                            <div className="col-lg-6 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                                <Autocomplete
                                                    size="small"
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                            }
                                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                        </Box>
                                                    )}
                                                    filterOptions={filterOptions}
                                                    value={newTimeSheet.client || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "client": value,
                                                                "cl_folder": ""
                                                            }))
                                                            get_client_folders(value.id,"newTs")
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
                                                    loadingText="Chargement en cours..."
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
                                        {
                                            newTimeSheet.type === 1 &&
                                            <div className="row mt-1">
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Montant</Typography>
                                                    <TextField
                                                        type={"number"}
                                                        variant="outlined"
                                                        value={newTimeSheet.prov_amount}
                                                        onChange={(e) =>{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "prov_amount": e.target.value
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
                                                            endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Compte bancaire</Typography>
                                                    <TextField
                                                        select
                                                        type={"text"}
                                                        variant="outlined"
                                                        value={newTimeSheet.prov_bank}
                                                        onChange={(e) =>{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "prov_bank": e.target.value
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
                                                        <MenuItem value={"abcd-test-1"}>Compte provision</MenuItem>
                                                        <MenuItem value={"abcd-test-2"}>Compte provision collaborateurs</MenuItem>
                                                        <MenuItem value={"abcd-test-3"}>Compte provision Camille</MenuItem>
                                                    </TextField>
                                                </div>
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Taxe</Typography>
                                                    <TextField
                                                        select
                                                        type={"text"}
                                                        variant="outlined"
                                                        value={newTimeSheet.prov_tax}
                                                        onChange={(e) =>{
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "prov_tax": e.target.value
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
                                                        <MenuItem value={0}>TVA due a 7.7% (TN)</MenuItem>
                                                        <MenuItem value={1}>TVA due a 7.7% (inclus. TN)</MenuItem>
                                                        <MenuItem value={2}>TVA 0% exclue</MenuItem>
                                                    </TextField>
                                                </div>
                                            </div>
                                        }
                                        {
                                            newTimeSheet.type === 0 &&
                                            <div className="row mt-1">
                                                <div className="col-lg-12 mb-1">
                                                    <Typography variant="subtitle1"
                                                                style={{fontSize: 14, color: "#616161"}}>
                                                        Description&nbsp;
                                                        <b>{newTimeSheet.client !== "" ? (newTimeSheet.client.lang === "fr" ? "(Français)" : "(Anglais)") : ""}</b>
                                                    </Typography>
                                                    <TextField
                                                        type={"text"}
                                                        multiline={true}
                                                        rows={4}
                                                        variant="outlined"
                                                        value={newTimeSheet.desc}
                                                        onChange={(e) => {
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
                                        }
                                        {
                                            newTimeSheet.type === 0 &&
                                            <div className="row mt-1">
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1" style={{
                                                        fontSize: 14,
                                                        color: "#616161"
                                                    }}>Utilisateur</Typography>
                                                    <Autocomplete
                                                        style={{width: "100%"}}
                                                        autoComplete={false}
                                                        autoHighlight={false}
                                                        size="small"
                                                        forcePopupIcon={true}
                                                        options={oa_users || []}
                                                        loading={oa_users}
                                                        loadingText="Chargement en cours..."
                                                        noOptionsText={""}
                                                        getOptionLabel={(option) => (option.last_name || "") + (option.first_name ? (" " + option.first_name) : "")}
                                                        renderOption={(props, option) => (
                                                            <Box component="li"
                                                                 sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
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
                                                            if (value) {
                                                                setNewTimeSheet(prevState => ({
                                                                    ...prevState,
                                                                    "user": value,
                                                                    "user_price": value.price || ""
                                                                }))
                                                            } else {
                                                                setNewTimeSheet(prevState => ({
                                                                    ...prevState,
                                                                    "user": "",
                                                                    "user_price": ""
                                                                }))
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            /*<OutlinedInput
                                                                {...params}
                                                                value={newTimeSheet.user || ""}
                                                                size="small"
                                                                startAdornment={
                                                                    <InputAdornment position="start">
                                                                        <img alt="" src={newTimeSheet.user.image || userAvatar} style={{width:25,height:25}}/>
                                                                    </InputAdornment>
                                                                }
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                                }}
                                                            />*/
                                                            <TextField
                                                                {...params}
                                                                variant={"outlined"}
                                                                value={newTimeSheet.user || ""}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    startAdornment:<InputAdornment position="start">
                                                                        <img alt="" src={newTimeSheet.user.image || userAvatar} style={{width:25,height:25}}/>
                                                                    </InputAdornment>,
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
                                                    <Typography variant="subtitle1"
                                                                style={{fontSize: 14, color: "#616161"}}>Taux
                                                        horaire</Typography>
                                                    <TextField
                                                        style={{width: "100%"}}
                                                        type={"text"}
                                                        variant="outlined"
                                                        inputMode="tel"
                                                        value={newTimeSheet.user_price}
                                                        onChange={(e) => {
                                                            setNewTimeSheet(prevState => ({
                                                                ...prevState,
                                                                "user_price": e.target.value
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
                                                            endAdornment: <InputAdornment
                                                                position="end">CHF/h</InputAdornment>,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {
                                        newTimeSheet.type === 0 &&
                                        <div className="mt-4">
                                            <div style={{display: "flex", justifyContent: "center"}}>
                                                <div>
                                                    <MuiButton variant="contained" color="primary" size="medium"
                                                               style={{textTransform: "none", fontWeight: 800}}
                                                               startIcon={<AddIcon color="white"/>}
                                                               disabled={newTimeSheet.date === "" || !utilFunctions.verif_duration(newTimeSheet.duration) || !newTimeSheet.client.id ||
                                                                   !newTimeSheet.cl_folder.id || !newTimeSheet.user.id ||
                                                                   isNaN(parseFloat(newTimeSheet.user_price)) || parseFloat(newTimeSheet.user_price) < 0}
                                                               onClick={() => {
                                                                   add_new_ts()
                                                               }}
                                                    >
                                                        Ajouter
                                                    </MuiButton>
                                                </div>
                                                <div>
                                                    <MuiButton variant="contained" color="primary" size="medium"
                                                               style={{
                                                                   textTransform: "none",
                                                                   fontWeight: 800,
                                                                   marginLeft: 15
                                                               }}
                                                               startIcon={<LibraryAddOutlinedIcon color="white"/>}
                                                               disabled={newTimeSheet.date === "" || !utilFunctions.verif_duration(newTimeSheet.duration) || !newTimeSheet.client.id ||
                                                                   !newTimeSheet.cl_folder.id || !newTimeSheet.user.id ||
                                                                   isNaN(parseFloat(newTimeSheet.user_price)) || parseFloat(newTimeSheet.user_price) < 0}
                                                               onClick={() => {
                                                                   add_new_ts(true)
                                                               }}
                                                    >
                                                        Ajouter & dupliquer
                                                    </MuiButton>
                                                </div>
                                                <div>
                                                    <MuiButton variant="outlined" color="primary" size="medium"
                                                               style={{
                                                                   textTransform: "none",
                                                                   fontWeight: 800,
                                                                   marginLeft: 15
                                                               }}
                                                               startIcon={<ClearAllOutlinedIcon color="primary"/>}
                                                               onClick={() => {
                                                                   clear_add_ts_form()
                                                               }}
                                                    >
                                                        Réinitialiser
                                                    </MuiButton>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        newTimeSheet.type === 1 &&
                                        <div className="mt-4">
                                            <div style={{display: "flex", justifyContent: "center"}}>
                                                <div>
                                                    <MuiButton variant={(newTimeSheet.date === "" || !newTimeSheet.client.id || !newTimeSheet.cl_folder.id ||
                                                        isNaN(parseFloat(newTimeSheet.prov_amount)) || parseFloat(newTimeSheet.prov_amount) <= 0 ||
                                                        newTimeSheet.prov_tax === "" || newTimeSheet.prov_bank === "") ? "contained" : "outlined"} color="primary" size="medium"
                                                               style={{textTransform: "none", fontWeight: 800}}
                                                               startIcon={<PreviewOutlinedIcon />}
                                                               disabled={newTimeSheet.date === "" || !newTimeSheet.client.id || !newTimeSheet.cl_folder.id ||
                                                                   isNaN(parseFloat(newTimeSheet.prov_amount)) || parseFloat(newTimeSheet.prov_amount) <= 0 ||
                                                                   newTimeSheet.prov_tax === "" || newTimeSheet.prov_bank === ""}
                                                               onClick={() => {

                                                               }}
                                                    >
                                                        Preview
                                                    </MuiButton>
                                                </div>
                                                <div>
                                                    <MuiButton variant="contained" color="primary" size="medium"
                                                               style={{
                                                                   textTransform: "none",
                                                                   fontWeight: 800,
                                                                   marginLeft: 15
                                                               }}
                                                               startIcon={<AddIcon color="white"/>}
                                                               disabled={newTimeSheet.date === "" || !newTimeSheet.client.id || !newTimeSheet.cl_folder.id ||
                                                                   isNaN(parseFloat(newTimeSheet.prov_amount)) || parseFloat(newTimeSheet.prov_amount) <= 0 ||
                                                                   newTimeSheet.prov_tax === "" || newTimeSheet.prov_bank === ""}
                                                               onClick={() => {
                                                                   create_invoice("provision",7.7,"",newTimeSheet.date,[],"fr",newTimeSheet.client,newTimeSheet.cl_folder,newTimeSheet.prov_amount,newTimeSheet.prov_bank)
                                                               }}
                                                    >
                                                        Créer la provision
                                                    </MuiButton>
                                                </div>
                                                <div>
                                                    <MuiButton variant="outlined" color="primary" size="medium"
                                                               style={{
                                                                   textTransform: "none",
                                                                   fontWeight: 800,
                                                                   marginLeft: 15
                                                               }}
                                                               startIcon={<ClearAllOutlinedIcon color="primary"/>}
                                                               onClick={() => {
                                                                   clear_add_ts_form()
                                                               }}
                                                    >
                                                        Réinitialiser
                                                    </MuiButton>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={tabs} index={1}>
                                <div align="center">
                                    <AltButtonGroup>
                                        <AtlButton appearance="default" isDisabled={selectedDate === ""}
                                                   iconBefore={<ChevronLeftIcon fontSize="small"/>}
                                                   size="medium"
                                                   onClick={() => {
                                                       setSelectedDate(moment(selectedDate).subtract(1,'d'))
                                                   }}
                                        >
                                            Jour précédent
                                        </AtlButton>
                                        <AtlButton  isSelected={selectedDate !== "" && moment(moment().format("YYYY-MM-DD")).isSame(selectedDate.format("YYYY-MM-DD"))}
                                                    onClick={() => {
                                                        setTm_sdate_search("")
                                                        setTm_edate_search("")
                                                        setSelectedDate(moment())
                                                        setTimesheets()
                                                        filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                            moment().unix(),moment().set({hour:0,minute:0,second:1}).unix())
                                                    }}
                                        >
                                            Aujourd'hui
                                        </AtlButton>
                                        <AtlButton appearance="default"  isDisabled={ (selectedDate !== "" && moment(moment().format("YYYY-MM-DD")).isSame(selectedDate.format("YYYY-MM-DD"))) || selectedDate === "" }
                                                   iconAfter={<ChevronRightIcon fontSize="small"/>}
                                                   onClick={() => {
                                                       setSelectedDate(moment(selectedDate).add(1,'d'))
                                                   }}
                                        >
                                            Jour suivant
                                        </AtlButton>
                                        <AtlButton appearance="default" isSelected={selectedDate === ""}
                                                   onClick={() => {
                                                       setSelectedDate("")
                                                   }}
                                        >
                                            Personnalisé
                                        </AtlButton>
                                    </AltButtonGroup>
                                </div>
                                <div align="right">
                                    <div style={{width:180,marginTop:-30}}>
                                        <Select
                                            size="small"
                                            className="single-select"
                                            classNamePrefix="react-select"
                                            options={[
                                                { label: 'Par TimeSheet', value: 'timesheet' },
                                                { label: 'Par dossier', value: 'dossier' }
                                            ]}
                                            value={showBy}
                                            defaultValue={{ label: 'Par TimeSheet', value: 'timesheet' }}
                                            onChange={(value) => {
                                                console.log(value)
                                                setShowBy(value)
                                            }}
                                            spacing="compact"
                                        />
                                    </div>
                                </div>
                                {
                                    selectedDate === "" &&
                                    <div style={{display:"flex",justifyContent:"center"}} className="mt-1">
                                        <div style={{alignSelf:"center"}}>
                                            <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>De</Typography>
                                        </div>
                                        <div style={{alignSelf:"center",width:150,marginLeft:8}}>
                                            <DatePicker spacing="compact" appearance="default"
                                                        value={tm_sdate_search} placeholder="DD/MM/YYYY"
                                                        dateFormat="DD/MM/YYYY"
                                                        onChange={(value) => {
                                                            if(tm_edate_search !== ""){
                                                                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                    moment(tm_edate_search).set({hour:23,minute:59,second:59}).unix(),moment(value).set({hour:0,minute:0,second:0}).unix())
                                                                setTm_sdate_search(value)
                                                            }else{
                                                                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                    "false",moment(value).set({hour:0,minute:0,second:0}).unix(),"false")
                                                                setTm_sdate_search(value)
                                                            }
                                                        }}
                                                        maxDate={tm_edate_search !== "" ? moment(tm_edate_search).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                            />
                                        </div>
                                        <div style={{alignSelf:"center",marginLeft:8}}>
                                            <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>{"à".toUpperCase()}</Typography>
                                        </div>
                                        <div style={{alignSelf:"center",width:150,marginLeft:8}}>
                                            <DatePicker spacing="compact" appearance="default"
                                                        value={tm_edate_search} placeholder="DD/MM/YYYY"
                                                        dateFormat="DD/MM/YYYY"
                                                        onChange={(value) => {
                                                            if(tm_sdate_search !== ""){
                                                                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                    value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false",
                                                                    moment(tm_sdate_search).set({hour:0,minute:0,second:0}).unix())
                                                                setTm_edate_search(value)
                                                            }else{
                                                                filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                    value !== "" ? moment(value).unix() : "false","false","false")
                                                                setTm_edate_search(value)
                                                            }

                                                        }}
                                                        minDate={tm_sdate_search ? moment(tm_sdate_search).format("YYYY-MM-DD") : null}
                                                        maxDate={moment().format("YYYY-MM-DD")}
                                            />
                                        </div>
                                    </div>
                                }
                                {
                                    selectedDate !== "" &&
                                    <div align="center" className="mt-2">
                                        <AtlButton appearance="warning">
                                            Le {selectedDate.format("DD MMMM YYYY")}
                                        </AtlButton>
                                    </div>
                                }
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
                                                           filter_timesheets(1,tsTableRows,"false","false", "false")
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
                                        <div className="row mt-2 ml-1">
                                            <div className="col-lg-4 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Utilisateur en charge de dossier</Typography>
                                                <Autocomplete
                                                    style={{width:"100%"}}
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={oa_users || []}
                                                    loading={!oa_users}
                                                    loadingText="Chargement en cours..."
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
                                                    value={tm_user_search || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setTm_user_search(value)
                                                        }else{
                                                            setTm_user_search("")
                                                        }
                                                        filter_timesheets(tsTablePage,tsTableRows,value ? value.id : "false",tm_client_search.id || "false",tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={tm_user_search || ""}
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
                                            <div className="col-lg-4 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                            }
                                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                        </Box>
                                                    )}
                                                    value={tm_client_search || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setTm_client_search(value)
                                                            setTm_client_folder_search("")
                                                            get_client_folders(value.id,"search")
                                                        }else{
                                                            setTm_client_search("")
                                                            setTm_client_folder_search("")
                                                            filter_timesheets(tsTablePage,tsTableRows,tm_user_search.id || "false","false","false")
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={tm_client_search || ""}
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
                                            <div className="col-lg-4 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Dossier</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={client_folders || []}
                                                    noOptionsText={"Aucun dossier trouvé"}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    loading={tm_client_folder_search !== "" && !client_folders}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                <FolderOpenOutlinedIcon color={"primary"}/>
                                                            }
                                                            &nbsp;&nbsp;{option.name || ""}
                                                        </Box>
                                                    )}
                                                    value={tm_client_folder_search || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setTm_client_folder_search(value)
                                                        }else{
                                                            setTm_client_folder_search("")
                                                        }
                                                        filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",value ? value.id.split("/").pop() : "false")
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={tm_client_folder_search || ""}
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
                                }
                                <div className="mt-2">
                                    {
                                        !timesheets ?
                                            <ShimmerTable row={3} col={4} size={"sm"}/> :
                                            <div>
                                                {
                                                    showBy.value === "timesheet" ?
                                                        <div>
                                                            {
                                                                ts_selected_rows && ts_selected_rows.length > 0 &&
                                                                <Typography className="mb-2" style={{fontWeight:600,marginTop:20}} color="primary">{ts_selected_rows.length + " timesheets sélectionnés"}</Typography>
                                                            }
                                                            <DataTable value={timesheets}
                                                                       rows={tsTableRows}
                                                                       onRowClick={(e) => {
                                                                           if(tm_client_search !== "" && tm_client_folder_search !== ""){

                                                                           }else{
                                                                               let ts_copy = _.cloneDeep(e.data)
                                                                               setToUpdateTsCopy(ts_copy)
                                                                               setToUpdateTs(prevState => ({
                                                                                   ...e.data,
                                                                                   "duration": utilFunctions.formatDuration(e.data.duration.toString())
                                                                               }))
                                                                               get_update_client_folders(e.data.client.id)
                                                                           }
                                                                       }}
                                                                       style={{minHeight:ts_selected_rows && ts_selected_rows.length > 0 ? "unset":265}}
                                                                       rowHover={true}
                                                                       dataKey="id"
                                                                       selectionMode={(tm_client_search !== "" && tm_client_folder_search !== "") ? "checkbox" : ""}
                                                                       selection={ts_selected_rows}
                                                                       onSelectionChange={e => {
                                                                           console.log(e)
                                                                           setTs_selected_rows(e.value)
                                                                       }}
                                                                       sortField="date"
                                                                       sortOrder={-1}
                                                                       removableSort={true}
                                                                       sortMode="single"
                                                                       size="small"
                                                                       emptyMessage="Aucun résultat trouvé"
                                                            >
                                                                {
                                                                    tm_client_search !== "" && tm_client_folder_search !== "" &&
                                                                    <Column selectionMode="multiple" ></Column>
                                                                }
                                                                <Column header="Date" sortable sortField="date" body={renderDateTemplate} align="center"></Column>
                                                                <Column header="Nom du dossier" body={renderClientFolderTemplate}></Column>
                                                                <Column field="desc" header="Description" style={{color:"black"}}></Column>
                                                                <Column header="Utilisateur" body={renderUserTemplate}></Column>
                                                                <Column header="Taux horaire" body={renderPriceTemplate} align="center"></Column>
                                                                <Column header="Durée" sortable sortField="duration" body={renderDurationTemplate} align="center"></Column>
                                                                <Column header="Total" body={renderTotalTemplate} align="center"></Column>
                                                                {
                                                                    (!ts_selected_rows || ts_selected_rows.length === 0) &&
                                                                    <Column field="" header="Actions" body={renderActionsTemplate}></Column>
                                                                }

                                                            </DataTable>
                                                            {
                                                                ts_selected_rows && ts_selected_rows.length > 0 &&
                                                                renderConfirmInvoiceForm()
                                                            }
                                                        </div> :
                                                        <div>
                                                            <DataTable value={groupedFormatedTsByFolder}
                                                                       expandedRows={expandedTsByFolderRows}
                                                                       onRowToggle={(e) => {
                                                                           console.log(e)
                                                                           setExpandedTsByFolderRows(e.data)
                                                                       }}
                                                                       rowExpansionTemplate={rowExpansionTemplate}
                                                                       //onRowExpand={this.onRowExpand}
                                                                       //onRowCollapse={this.onRowCollapse}
                                                                       rows={tsTableRows}
                                                                       //rowHover={true}
                                                                       removableSort={true}
                                                                       size="small"
                                                                       emptyMessage="Aucun résultat trouvé"
                                                            >
                                                                <Column expander/>
                                                                <Column header="Client" body={renderClientTemplate}></Column>
                                                                <Column header="Dossier" body={renderFolderTemplate}></Column>
                                                                <Column header="Utilisateurs" body={RenderAssociesTemplate}></Column>
                                                                <Column header="Utilisateur en charge de dossier" body={RenderUserInChargeTemplate}></Column>
                                                                <Column header="Total(h)" body={renderTotalHoursTemplate}></Column>
                                                                <Column header="Total(CHF)" body={renderTotalPriceTemplate}></Column>
                                                            </DataTable>
                                                        </div>
                                                }

                                                <Paginator first={tsTableFirst} rows={tsTableRows}
                                                           totalRecords={tsTableTotal}
                                                           rowsPerPageOptions={[5, 10, 20, 30]}
                                                           onPageChange={onTsTablePageChange}
                                                           template={tsTableTemplate}
                                                >
                                                </Paginator>
                                            </div>
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={tabs} index={2}>
                                <div style={{display:"flex",alignSelf:"center",justifyContent:"space-between"}}>
                                    <div style={{display: "flex", cursor: "pointer"}}
                                         onClick={() => {setShowSearchFactForm(!showSearchFactForm)}}
                                    >
                                        {
                                            !showSearchFactForm ?
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
                                            showSearchFactForm &&
                                            <MuiButton variant="text" color="primary" size="medium"
                                                       style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                                                       startIcon={<ClearAllOutlinedIcon color="primary"/>}
                                                       onClick={() => {
                                                           clear_search_fact_form()
                                                           filter_invoices(1,factTableRows,"false","false", "false")
                                                       }}
                                            >
                                                Réinitialiser
                                            </MuiButton>
                                        }
                                    </div>
                                </div>
                                {
                                    showSearchFactForm &&
                                    <div>
                                        <div className="row mt-1">
                                            <div className="col-lg-12 mb-1">
                                                <div style={{display:"flex",justifyContent:"center"}} className="mt-1">
                                                    <div style={{alignSelf:"center"}}>
                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>De</Typography>
                                                    </div>
                                                    <div style={{alignSelf:"center",width:200,marginLeft:8}}>
                                                        <DatePicker spacing="compact" appearance="default"
                                                                    value={inv_search_date1} placeholder="DD/MM/YYYY"
                                                                    dateFormat="DD/MM/YYYY"
                                                                    onChange={(value) => {
                                                                        console.log(value)
                                                                        if(inv_search_date2 !== ""){
                                                                            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                                                                                moment(inv_search_date2).set({hour:23,minute:59,second:59}).unix(),value !== "" ? moment(value).set({hour:0,minute:0,second:0}).unix() : "false")
                                                                        }else{
                                                                            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                                                                                "false",value !== "" ? moment(value).set({hour:0,minute:0,second:0}).unix() : "false","false")
                                                                        }
                                                                        setInv_search_date1(value)
                                                                    }}
                                                                    maxDate={inv_search_date2 !== "" ? moment(inv_search_date2).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                                        />
                                                    </div>
                                                    <div style={{alignSelf:"center",marginLeft:8}}>
                                                        <Typography variant="subtitle1" style={{fontSize: 12, color: "#616161"}}>{"à".toUpperCase()}</Typography>
                                                    </div>
                                                    <div style={{alignSelf:"center",width:200,marginLeft:8}}>
                                                        <DatePicker spacing="compact" appearance="default"
                                                                    value={inv_search_date2} placeholder="DD/MM/YYYY"
                                                                    dateFormat="DD/MM/YYYY"
                                                                    onChange={(value) => {
                                                                        if(inv_search_date1 !== ""){
                                                                            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                                                                                value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false",
                                                                                moment(inv_search_date1).set({hour:0,minute:0,second:0}).unix())
                                                                            setInv_search_date2(value)
                                                                        }else{
                                                                            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                                                                                value !== "" ? moment(value).unix() : "false","false","false")
                                                                            setInv_search_date2(value)
                                                                        }

                                                                    }}
                                                                    minDate={inv_search_date1 ? moment(inv_search_date1).format("YYYY-MM-DD") : null}
                                                                    maxDate={moment().format("YYYY-MM-DD")}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-1">
                                            <div className="col-lg-3 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                            }
                                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                        </Box>
                                                    )}
                                                    value={inv_search_client || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setInv_search_client(value)
                                                            setInv_search_client_folder("")
                                                            get_fact_client_folders(value.id,"search_fact")
                                                        }else{
                                                            setInv_search_client("")
                                                            setInv_search_client_folder("")
                                                            setFact_client_folders()
                                                            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false","false","false")
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={inv_search_client || ""}
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
                                            <div className="col-lg-3 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Dossier</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={fact_client_folders || []}
                                                    noOptionsText={"Aucun dossier trouvé"}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    loading={inv_search_client_folder !== "" && !fact_client_folders}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                <FolderOpenOutlinedIcon color={"primary"}/>
                                                            }
                                                            &nbsp;&nbsp;{option.name || ""}
                                                        </Box>
                                                    )}
                                                    value={inv_search_client_folder || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setInv_search_client_folder(value)
                                                        }else{
                                                            setInv_search_client_folder("")
                                                        }
                                                        filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",value ? value.id.split("/").pop() : "false")
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={inv_search_client_folder || ""}
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
                                            <div className="col-lg-3 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Utilisateur</Typography>
                                                <Autocomplete
                                                    style={{width:"100%"}}
                                                    autoComplete={false}
                                                    autoHighlight={false}
                                                    size="small"
                                                    options={oa_users || []}
                                                    loading={!oa_users}
                                                    loadingText="Chargement en cours..."
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
                                                    value={inv_search_user || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            console.log(value)
                                                            setInv_search_user(value)
                                                        }else{
                                                            setInv_search_user("")
                                                        }
                                                        filter_invoices(factTablePage,factTableRows,value ? value.id : "false",inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false")
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={inv_search_user || ""}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                startAdornment: <InputAdornment position='start'></InputAdornment>,
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
                                            <div className="col-lg-3 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Statut</Typography>
                                                <TextField
                                                    select
                                                    type={"text"}
                                                    variant="outlined"
                                                    value={inv_search_status}
                                                    onChange={(e) => {
                                                        setInv_search_status(e.target.value)
                                                        //filter_invoices(factTablePage,factTableRows,value ? value.id : "false",inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false")
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
                                                    <MenuItem value={-1}>Tous</MenuItem>
                                                    <MenuItem value={0}>En attente</MenuItem>
                                                    <MenuItem value={1}>Validée</MenuItem>
                                                    <MenuItem value={2}>Payée</MenuItem>
                                                </TextField>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    !invoices ?
                                        <ShimmerTable row={3} col={4} size={"sm"}/> :
                                        <div className="mt-3">
                                            <DataTable value={invoices}
                                                       expandedRows={expandedFactRows}
                                                       onRowToggle={(e) => {
                                                           setexpandedFactRows(e.data)
                                                       }}
                                                       onRowExpand={(e) => {
                                                           console.log(e.data)
                                                           projectFunctions.get_timesheet_array_detail(e.data.client.id,e.data.client_folder.id,e.data.timesheet).then( res => {
                                                               let newData = e.data
                                                               console.log(res)
                                                               newData.timesheet = res
                                                               setUpdateScreen(!updateScreen)
                                                           }).catch( err => {
                                                               console.log(err)
                                                               setLoading(false)
                                                               toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                                           })
                                                       }}
                                                       rowExpansionTemplate={rowExpansionFactTemplate}
                                                       responsiveLayout="scroll"
                                                       sortField="date"
                                                       sortOrder={-1}
                                                       removableSort={true}
                                                       sortMode="single"
                                                       size="small"
                                                       emptyMessage="Aucun résultat trouvé"
                                            >
                                                <Column expander={allowFactExpansion}/>
                                                <Column header="Type" body={renderFactTypeTemplate}></Column>
                                                <Column header="Date" body={renderFactDateTemplate} sortable sortField="date"></Column>
                                                <Column header="Client" body={RenderFactClientTemplate} align="center"></Column>
                                                <Column header="Dossier" body={renderFactFolderTemplate} align="center"></Column>
                                                <Column header="Montant HT" align="center" body={renderFactTotatHtTemplate}></Column>
                                                <Column header="Taxe" align="center" body={renderFactTaxeTemplate}></Column>
                                                <Column header="Total" align="center" body={renderFactTotalTemplate}></Column>
                                                <Column header="Statut" align="center" body={renderFactStatusTemplate}></Column>
                                                <Column header="Paiement" align="center" body={renderFactPaymentTemplate}></Column>
                                                <Column header="Actions" body={renderFactActionsTemplate}></Column>
                                            </DataTable>
                                            <Paginator first={factTableFirst} rows={factTableRows}
                                                       totalRecords={factTableTotal}
                                                       rowsPerPageOptions={[5, 10, 20, 30]}
                                                       onPageChange={onFactTablePageChange}
                                                       template={factTableTemplate}
                                            >
                                            </Paginator>
                                        </div>
                                }

                            </TabPanel>
                            <TabPanel value={tabs} index={3}>

                            </TabPanel>
                            <TabPanel value={tabs} index={4}>

                            </TabPanel>
                        </div>

                    </div>
                </div>
            </div>


            {
                toUpdateTs &&
                <Dialog
                    open={openTsModal}
                    aria-labelledby="form-dialog-title"
                    fullWidth={"md"}
                    style={{zIndex: 100}}

                >
                    <DialogTitle disableTypography id="form-dialog-title">
                        <Typography variant="h6" color="primary" style={{fontWeight:700}}>Modifier TimeSheet</Typography>
                        <IconButton
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 5,
                                top: 5,
                                color: '#000'
                            }}
                            onClick={() => {
                                setOpenTsModal(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <hr style={{marginBottom:5,marginTop:15}}/>
                    </DialogTitle>
                    <DialogContent style={{overflowY: "inherit"}}>
                        <div className="pl-1 pr-1 mt-2">
                            <div className="row">
                                <div className="col-lg-6 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Date</Typography>
                                        <TextField
                                            type={"datetime-local"}
                                            variant="outlined"
                                            value={toUpdateTs.date ? moment.unix(toUpdateTs.date).format("YYYY-MM-DD HH:mm") : ""}
                                            onChange={(e) =>{
                                                console.log(e.target.value)
                                                setToUpdateTs(prevState => ({
                                                    ...prevState,
                                                    "date": moment(e.target.value).unix()
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
                                        value={toUpdateTs.duration || ""}
                                        onChange={(event, value) => {
                                            console.log(value)
                                            setToUpdateTs(prevState => ({
                                                ...prevState,
                                                "duration": value ? (value || "") : ""
                                            }))
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                value={toUpdateTs.duration}
                                                error={toUpdateTs.duration !== "" && !utilFunctions.verif_duration(toUpdateTs.duration)}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                    placeholder:"Format: --h--",
                                                    onChange:(e) => {
                                                        let value = e.target.value
                                                        console.log(value)
                                                        setToUpdateTs(prevState => ({
                                                            ...prevState,
                                                            "duration": value
                                                        }))
                                                    }
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
                                    {
                                        toUpdateTs.duration && !utilFunctions.verif_duration(toUpdateTs.duration) &&
                                        <Typography variant="subtitle1" color="error">Format invalide, Veuillez utiliser le format --h--</Typography>
                                    }
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
                                            loadingText="Chargement en cours..."
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    {
                                                        option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                    }
                                                    &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                </Box>
                                            )}
                                            value={(clients || []).find(x => x.id === toUpdateTs.client.id) || ""}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client": {id:value.id,name:projectFunctions.get_client_title(value)},
                                                        "client_folder": {id:"",name:""}
                                                    }))
                                                    setUpdate_client_folders()
                                                    get_update_client_folders_after(value.id)
                                                }else{
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client": {id:"",name:""},
                                                        "client_folder": {id:"",name:""}
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant={"outlined"}
                                                    value={toUpdateTs.client.id || ""}
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
                                            options={update_client_folders || []}
                                            noOptionsText={"Aucun dossier trouvé"}
                                            getOptionLabel={(option) => option.name || ""}
                                            loading={toUpdateTs.client !== "" && !update_client_folders}
                                            loadingText="Chargement en cours..."
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    {
                                                        <FolderOpenOutlinedIcon color={"primary"}/>
                                                    }
                                                    &nbsp;&nbsp;{option.name || ""}
                                                </Box>
                                            )}
                                            value={(update_client_folders || []).find(x => x.id.split("/").pop() === toUpdateTs.client_folder.id) || ""}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client_folder": {id:value.id.split("/").pop(),name:value.name}
                                                    }))
                                                }else{
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client_folder": {id:"",name:""}
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant={"outlined"}
                                                    value={toUpdateTs.client_folder.id || ""}
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
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>
                                            Description&nbsp;<b>{toUpdateTs.client !== "" ? (toUpdateTs.client.lang === "fr" ? "(Français)" : "(Anglais)") : ""}</b>
                                        </Typography>
                                        <TextField
                                            type={"text"}
                                            multiline={true}
                                            rows={4}
                                            variant="outlined"
                                            value={toUpdateTs.desc}
                                            onChange={(e) =>{
                                                setToUpdateTs(prevState => ({
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
                                            loading={oa_users}
                                            loadingText="Chargement en cours..."
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
                                            value={(oa_users || []).find(x => x.id === toUpdateTs.user) || ""}
                                            onChange={(event, value) => {
                                                if(value){
                                                    console.log(value)
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "user": value.id,
                                                        "price":value.price || ""
                                                    }))
                                                }else{
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "user": "",
                                                        "price":""
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant={"outlined"}
                                                    value={toUpdateTs.user || ""}
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
                                            value={toUpdateTs.price || ""}
                                            onChange={(e) => {
                                                setToUpdateTs(prevState => ({
                                                    ...prevState,
                                                    "price":e.target.value
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
                    </DialogContent>
                    <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                        <MuiButton
                            onClick={() => {
                                setOpenTsModal(false)
                            }}
                            color="primary"
                            variant="outlined"
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton
                            disabled={toUpdateTs.date === ""  || toUpdateTs.client_folder.id === "" || toUpdateTs.user === "" || toUpdateTs.client.id === ""
                                || !utilFunctions.verif_duration(toUpdateTs.duration)
                                 || isNaN(parseFloat(toUpdateTs.price)) || parseFloat(toUpdateTs.price) < 0 }
                            onClick={() => {
                                update_ts(toUpdateTs)
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
                        Supprimer timeSheet
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateTs &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de supprimer ce timesheet
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
                                   delete_ts()
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>

            <Modal backdrop={true} role="alertdialog" open={openDeleteFactModal}
                   onClose={() => {setOpenDeleteFactModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    <Typography variant="h6" color="primary" style={{fontWeight:700,fontSize:16}}>
                        Supprimer facture
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateFact &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de supprimer cette facture
                            </Typography>
                        </div>
                    </Modal.Body>
                }

                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700}}
                               onClick={() => {
                                   setOpenDeleteFactModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem",backgroundColor:"#D50000"}}
                               onClick={() => {
                                   delete_fact()
                               }}
                    >
                        Supprimer
                    </MuiButton>

                </Modal.Footer>
            </Modal>
        </div>
    )}