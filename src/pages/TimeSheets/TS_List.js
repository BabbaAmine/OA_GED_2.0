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
import {
    alphabet,
    fact_ts_templates,
    oa_comptes_bank_factures, oa_comptes_bank_provision, oa_fees,
    oa_taxs,
    payment_terms,
    timeSuggestions
} from "../../data/data";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ApiBackService from "../../provider/ApiBackService";
import utilFunctions from "../../tools/functions";
import RenderAsyncUserAvatar from "../../components/Avatars/AsyncUserAvatar";
import AtlButton, { ButtonGroup as AltButtonGroup } from '@atlaskit/button';
import Select from '@atlaskit/select';
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
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import RenderUserAvatarImage from "../../components/Avatars/UserAvatarImage";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import {Button} from "primereact/button";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { motion } from "framer-motion";
import { Popup } from 'semantic-ui-react'
import UserAvatar from "../../components/Avatars/UserAvatar";

const filterOptions = (options, state) => {
    let newOptions = [];
    options.forEach((element) => {
        let text = element.type === 0 ? (element.name_2 || "") : ((element.name_2 || "") + ((element.name_1 && element.name_1.trim() !== "") ? (" " + element.name_1) : ""))
        if (text.toLowerCase().includes(state.inputValue.toLowerCase())) newOptions.push(element);
    });
    return newOptions;
};
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

const tsByTableTemplate = {
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
    const [waitInvoiceTimesheets, setWaitInvoiceTimesheets] = React.useState(false);

    const [tabs, setTabs] = React.useState(0);
    const [clients, setClients] = React.useState();
    const [client_folders, setClient_folders] = React.useState();
    const [wip_client_folders, setWip_client_folders] = React.useState();
    const [update_client_folders, setUpdate_client_folders] = React.useState();
    const [oa_users, setOa_users] = React.useState();

    const [selectedDate, setSelectedDate] = React.useState(moment());
    const [showSearchForm, setShowSearchForm] = React.useState(true);
    const [tm_client_search, setTm_client_search] = React.useState("");
    const [tm_client_folder_search, setTm_client_folder_search] = React.useState("");
    const [tm_user_search, setTm_user_search] = React.useState("");
    const [tm_user_in_charge_search, setTm_user_in_charge_search] = React.useState("");
    const [tm_sdate_search, setTm_sdate_search] = React.useState();
    const [tm_edate_search, setTm_edate_search] = React.useState();

    const [newTimeSheet, setNewTimeSheet] = React.useState({
        type:0,
        duration:"",
        desc:"",
        date:moment().format("YYYY-MM-DD"),
        client:"",
        cl_folder:"",
        user:"",
        user_price:"",
        prov_amount:"",
        prov_bank:"1",
        prov_tax:"0"
    });
    const [newTimeSheetInvoice, setNewTimeSheetInvoice] = React.useState({
        duration:"",
        desc:"",
        date:moment().format("YYYY-MM-DD"),
        client:"",
        cl_folder:"",
        user:"",
        user_price:""
    });
    const [newTsInvoiceData, setNewTsInvoiceData] = React.useState();
    const [invoiceProvisions, setInvoiceProvisions] = React.useState();
    const [invoiceSelectedProvisions, setInvoiceSelectedProvisions] = React.useState();
    const [toUpdateTs, setToUpdateTs] = React.useState();
    const [toUpdateTsCopy, setToUpdateTsCopy] = React.useState();
    const [updateTsFromInvoice, setUpdateTsFromInvoice] = React.useState(false);
    const [openTsModal, setOpenTsModal] = React.useState(false);
    const [openFactModal, setOpenFactModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openDeleteFactModal, setOpenDeleteFactModal] = React.useState(false);
    const [openValidateFactModal, setOpenValidateFactModal] = React.useState(false);
    const [openPaymFactModal, setOpenPaymFactModal] = React.useState(false);
    const [openNewTsInvoiceModal, setOpenNewTsInvoiceModal] = React.useState(false);
    const [openRemoveTsInvoiceModal, setOpenRemoveTsInvoiceModal] = React.useState(false);


    const [tsTableFirst, setTsTableFirst] = React.useState(0);
    const [tsTablePage, setTsTablePage] = React.useState(1);
    const [tsTableRows, setTsTableRows] = React.useState(5);
    const [tsTableTotal, setTsTableTotal] = React.useState(5);

    const [tsByTableFirst, setTsByTableFirst] = React.useState(0);
    const [tsByTablePage, setTsByTablePage] = React.useState(1);
    const [tsByTableRows, setTsByTableRows] = React.useState(5);
    const [tsByTableTotal, setTsByTableTotal] = React.useState(5);

    const [timesheets, setTimesheets] = React.useState();
    const [groupedTsByFolder, setGroupedTsByFolder] = React.useState();
    const [waitTsBy, setWaitTsBy] = React.useState(false);
    const [ts_selected_rows, setTs_selected_rows] = React.useState();
    const [showBy, setShowBy] = React.useState({ label: 'Par TimeSheet', value: 'timesheet' });
    const [expandedTsByFolderRows, setExpandedTsByFolderRows] = React.useState();
    const [partnerValidation, setPartnerValidation] = React.useState("");
    const [invoice_date, setInvoice_date] = React.useState(moment().format("YYYY-MM-DD"));

    const [invoices, setInvoices] = React.useState();
    const [toUpdateFact, setToUpdateFact] = React.useState();
    const [toUpdateTsInvoice, setToUpdateTsInvoice] = React.useState();
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
    const [draft_invoice_template, setDraft_invoice_template] = React.useState("1");
    const [draft_invoice_bank, setDraft_invoice_bank] = React.useState("1");
    const [draft_invoice_paym_condition, setDraft_invoice_paym_condition] = React.useState("1");
    const [draft_invoice_taxe, setDraft_invoice_taxe] = React.useState("0");
    const [draft_invoice_fees, setDraft_invoice_fees] = React.useState("0");
    const [draft_invoice_reduction_type, setDraft_invoice_reduction_type] = React.useState("percent");
    const [draft_invoice_reduction, setDraft_invoice_reduction] = React.useState("");

    const [wip_client, setWip_client] = React.useState("");
    const [wip_client_folder, setWip_client_folder] = React.useState("");
    const [unusedTimesheets, setUnusedTimesheets] = React.useState();

    const [timehseets_sum, seTtimehseets_sum] = React.useState();
    const [bills_sum, setBills_sum] = React.useState();
    const [unusedTs_sum, setUnusedTs_sum] = React.useState();

    const onTsTablePageChange = (event) => {
        setTsTableFirst(event.first);
        setTsTableRows(event.rows);
        setTsTablePage(event.page + 1)
        /*get_timesheets(event.page + 1,event.rows)*/
        filter_timesheets(event.page + 1,event.rows,tm_user_search.id || "false",tm_client_search.id || "false",
            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
            "false","false")
    }
    const onTsByTablePageChange = (event) => {
        setTsByTableFirst(event.first);
        setTsByTableRows(event.rows);
        setTsByTablePage(event.page + 1)
        filter_timesheets_by_folder(event.page + 1,event.rows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
            "false","false")
    }
    const onFactTablePageChange = (event) => {
        setFactTableFirst(event.first);
        setFactTableRows(event.rows);
        setFactTablePage(event.page + 1)
        /*get_timesheets(event.page + 1,event.rows)*/
        filter_invoices(event.page + 1,event.rows,inv_search_user.id || "false",inv_search_client.id || "false",
            inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false",
            "false","false","true")
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
            inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? parseInt(inv_search_status) : "false",
            "false","false","true")
    }, [])

    //selectedDate
    useEffect(() => {
        if(selectedDate === ""){
            if(showBy.value === "timesheet"){
                setTsTableFirst(0)
                filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                    "false","false")
            }else{
                setTsByTableFirst(0)
                filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                    "false","false")
            }

        }else{
            if(showBy.value === "timesheet"){
                setTsTableFirst(0)
                filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                    moment(selectedDate).set({hour:23,minute:59,second:59}).unix(),moment(selectedDate).set({hour:0,minute:0,second:1}).unix())
            }else{
                setTsByTableFirst(0)
                filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                    moment(selectedDate).set({hour:23,minute:59,second:59}).unix(),moment(selectedDate).set({hour:0,minute:0,second:1}).unix())
            }
        }
    }, [selectedDate])

    //Selected Invocie
    /*useEffect(() => {
        console.log("CHANGED FROM UseEffect")
        console.log(newTsInvoiceData)
        setWaitInvoiceTimesheets(false)
        setLoading(false)
    }, [newTsInvoiceData])*/


    const filter_timesheets = (page,number,user,client,client_folder,l_date,g_date,verif_inputs) => {
        setLoading(true)
        let filter = {}
        let less = {}
        let greater = {}
        if(user && user !== "false"){
            if(showBy.value === "timesheet") filter.user = user
            else filter.user_in_charge = user
        }
        if(client && client !== "false") filter = {...filter,client:client}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:client_folder}

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
        ApiBackService.get_timesheets({filter:filter,less:less,greater:greater},page,number).then( res => {
            if(res.status === 200 && res.succes === true){
                seTtimehseets_sum()
                seTtimehseets_sum(prevState => ({
                    ...prevState,
                    price:res.data.sum ? res.data.sum.price.toFixed(2) : "",
                    duration:res.data.sum ? utilFunctions.formatDuration(res.data.sum.duration.toString()) : ""
                }))
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

    const filter_timesheets_by_folder = (page,number,user,client,client_folder,l_date,g_date,verif_inputs) => {
        setLoading(true)
        let filter = {
            status:0
        }
        let less = {}
        let greater = {}
        if(user && user !== "false"){
            filter.user_in_charge = user
        }
        if(client && client !== "false") filter = {...filter,client:client}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:client_folder}

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
        ApiBackService.get_timesheets_by_folder({filter:filter,less:less,greater:greater},page,number).then( res => {
            if(res.status === 200 && res.succes === true){
                seTtimehseets_sum()
                seTtimehseets_sum(prevState => ({
                    ...prevState,
                    price:res.data.sum ? res.data.sum.price.toFixed(2) : "",
                    duration:res.data.sum ? utilFunctions.formatDuration(res.data.sum.duration.toString()) : ""
                }))
                setTsByTableTotal(res.data.pagination.total)
                setGroupedTsByFolder(res.data.list)
                setLoading(false)
            }else{
                setLoading(false)
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
            }
        }).catch( err => {setLoading(false)
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
        })
    }

    const filter_invoices = (page,number,user,client,client_folder,status,l_date,g_date,verif_inputs) => {
        setLoading(true)
        let filter = {}
        let less = {}
        let greater = {}
        if(user && user !== "false") filter.user = user
        if(client && client !== "false") filter = {...filter,client:client}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:client_folder}
        if(status !== "false" && status > -1) filter = {...filter,status:status}

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
        ApiBackService.get_invoices({filter:filter,less:less,greater:greater},page,number).then( res => {
            if(res.status === 200 && res.succes === true){
                setBills_sum()
                setBills_sum(prevState => ({
                    ...prevState,
                    price_HT:res.data.sum ? res.data.sum.HT.toFixed(2) : "",
                    price_TVA:res.data.sum ? res.data.sum.taxes.toFixed(2) : "",
                    Price_TTC:res.data.sum ? res.data.sum.total.toFixed(2) : "",
                }))
                setFactTableTotal(res.data.pagination.total)
                setInvoices(res.data.list)
                setLoading(false)
            }else{
                console.log(res.error)
                setLoading(false)
                toast.warn(res.error || "Une erreur est survenue, veuillez recharger  la page")
            }
        }).catch( err => {setLoading(false)
            toast.warn("Une erreur est survenue, veuillez recharger  la page")
        })
    }

    const filter_unused_timesheets = (client,client_folder) => {
        setLoading(true)
        let filter= {
            status:0
        }
        if(client && client !== "false") filter = {...filter,client:client}
        if(client_folder && client_folder !== "false") filter = {...filter,client_folder:client_folder}
        ApiBackService.get_timesheets({filter:filter},1,1000).then( res => {
            if(res.status === 200 && res.succes === true){
                setUnusedTs_sum(prevState => ({
                    ...prevState,
                    price:res.data.sum ? res.data.sum.price.toFixed(2) : "",
                    duration:res.data.sum ? utilFunctions.formatDuration(res.data.sum.duration.toString()) : ""
                }))
                setUnusedTimesheets(res.data.list)
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

    const get_client_folder_provisions = (client_id,folder_id) => {
        return new Promise( resolve => {
            let filter = {
                type:"provision",
                status:2,
                client:client_id,
                client_folder:folder_id
            }
            ApiBackService.get_invoices({filter:filter,exclude: ""},1,100).then( res => {
                console.log(res)
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list)
                }else{
                    resolve("false")
                }
            }).catch( err => {
                resolve("false")
            })
        })
    }

    const get_clients = async () => {
        let clients = await Project_functions.get_clients({}, "", 1, 5000)
        if (clients && clients !== "false") {
            /*clients.map(option => {
                option.label = option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))
            })*/
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

    const get_client_folders = async (client_id,updateFirst,data) => {
        let client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(client_folders && client_folders !== "false"){
            setClient_folders(client_folders)
            if(updateFirst && updateFirst === "search"){
                setTm_client_folder_search(client_folders.length > 0 ? client_folders[0] : "")
                if(showBy.value === "timesheet"){
                    setTsTableFirst(0)
                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",
                        client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")
                }else{
                    setTsByTableFirst(0)
                    filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",
                        client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")
                }
            }
            if(updateFirst && updateFirst === "search_fact"){
                setInv_search_client_folder(client_folders.length > 0 ? client_folders[0] : "")
            }
            if(updateFirst && updateFirst === "newTs" && client_folders.length > 0){
                setNewTimeSheet(prevState => ({
                    ...prevState,
                    "cl_folder": client_folders[0]
                }))
                let find_user_in_folder = client_folders[0].associate.find(x => x.id === newTimeSheet.user.id)
                if(find_user_in_folder){
                    setNewTimeSheet(prevState => ({
                        ...prevState,
                        "user_price": find_user_in_folder.price
                    }))
                }
            }
            if(updateFirst && updateFirst === "newTsModal" && client_folders.length > 0){
                setLoading(false)
                setNewTimeSheetInvoice(prevState => ({
                    ...prevState,
                    "client":(clients || []).find(x => x.id === client_id),
                    "cl_folder": client_folders.find(x => x.id.split("/").pop() === data.id.split("/")[1])
                }))
                setOpenNewTsInvoiceModal(true)
            }
            if(updateFirst && updateFirst === "wip"){
                setWip_client_folders(client_folders)
                setWip_client_folder(client_folders.length > 0 ? client_folders[0] : "")
                filter_unused_timesheets(client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false")
            }
        }else{
            console.error("ERROR GET LIST CLIENTS FOLDERS")
        }
    }

    const get_fact_client_folders = async (client_id,updateFirst) => {
        let client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(client_folders && client_folders !== "false"){
            setFact_client_folders(client_folders)
            if(updateFirst && updateFirst === "search_fact"){
                setInv_search_client_folder(client_folders.length > 0 ? client_folders[0] : "")
                setFactTableFirst(0)
                filter_invoices(1,factTableRows,inv_search_user.id || "false",
                    client_id,client_folders.length > 0 ? client_folders[0].id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false","false","false","true")
            }
        }else{
            console.error("ERROR GET LIST CLIENTS FOLDERS")
        }
    }

    const get_update_client_folders = async (client_id,type) => {
        console.log(client_id)
        setLoading(true)
        let update_client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(update_client_folders && update_client_folders !== "false"){
            setUpdate_client_folders(update_client_folders)
            if(type === "ts"){
                let client_data = (clients || []).find(x => x.id === client_id)
                //console.log(client_data)
                if(client_data){
                    setToUpdateTs(prevState => ({
                        ...prevState,
                        "lang": client_data.lang
                    }))
                    setLoading(false)
                    setOpenTsModal(true)
                }
            }else if(type === "invoice"){
                setLoading(false)
                setOpenFactModal(true)
            }
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const get_update_client_folders_after = async (client_id,type) => {
        let update_client_folders = await Project_functions.get_client_folders(client_id,{},"",1,100)
        if(update_client_folders && update_client_folders !== "false"){
            setUpdate_client_folders(update_client_folders)
            type === "ts" && setToUpdateTs(prevState => ({
                ...prevState,
                "client_folder": update_client_folders.length > 0 ? update_client_folders[0].id : ""
            }))
            type === "invoice" && setToUpdateFact(prevState => ({
                ...prevState,
                "client_folder": update_client_folders.length > 0 ? update_client_folders[0].id : ""
            }))
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const get_oa_users = async () => {
        let oa_users = await Project_functions.get_oa_users({},"",1,200)
        if(oa_users && oa_users !== "false"){
            setOa_users(oa_users)
            let find_current_user = oa_users.find(x => x.email === localStorage.getItem("email"))
            console.log(find_current_user)
            if(find_current_user){
                setNewTimeSheet(prevState => ({
                    ...prevState,
                    "user": find_current_user,
                    "user_price":find_current_user.price
                }))
                setTm_user_search(find_current_user)
                setInv_search_user(find_current_user)
                setPartnerValidation(find_current_user)
            }
        }else{
            console.error("ERROR GET LIST USERS")
            setTimeout(() => {
                get_oa_users()
            },30000)
        }
    }

    const clear_search_form = () => {
        setTsTablePage(1)
        setTm_sdate_search("")
        setTm_edate_search("")
        setTm_client_search("")
        setTm_client_folder_search("")
        setClient_folders()
        setTm_user_search("")
        setTm_user_in_charge_search("")
    }

    const clear_search_fact_form = () => {
        setInv_search_client("")
        setInv_search_client_folder("")
        setInv_search_user("")
        setInv_search_status(-1)
        setInv_search_date1("")
        setInv_search_date2("")
    }

    const clear_add_ts_form = () => {
        setNewTimeSheet({
            type:newTimeSheet.type,
            duration:"",
            desc:"",
            date:moment().format("YYYY-MM-DD"),
            client:"",
            cl_folder:"",
            user:newTimeSheet.user,
            user_price:newTimeSheet.user_price,
            prov_bank: "1",
            prov_tax: "0",
            prov_amount: ""
        })
    }

    const clear_add_ts_modal_form = () => {
        setNewTimeSheetInvoice({
            duration:"",
            desc:"",
            date:moment().format("YYYY-MM-DD"),
            client:"",
            cl_folder:"",
            user:"",
            user_price:""
        })
    }

    const add_new_ts = (duplicate) => {
        setLoading(true)
        let folder_id_array = newTimeSheet.cl_folder.id.split("/")
        let folder_id = folder_id_array[1]
        let newItem = {
            date:moment(newTimeSheet.date).set({hour:moment().hour(),minute:moment().minute(),second:moment().second()}).unix(),
            /*type:newTimeSheet.type,*/
            client:newTimeSheet.client.id,
            client_folder:newTimeSheet.client.id + "/" + folder_id,
            user:newTimeSheet.user.id,
            desc:newTimeSheet.desc,
            duration:utilFunctions.durationToNumber(newTimeSheet.duration),
            price:newTimeSheet.user_price
        }
        if(typeof newItem.price === "string") newItem.price = parseFloat(newItem.price)
        ApiBackService.add_ts(newItem.client,folder_id,newItem).then( res => {
            if(res.status === 200 && res.succes === true){
                setTsTableFirst(0)
                filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                    tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                filter_unused_timesheets(wip_client.id || "false",wip_client_folder.id ? wip_client_folder.id.split("/").pop() : "false")
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
        setTimeout(() => {
            toUpdateTs.duration = utilFunctions.durationToNumber(toUpdateTs.duration)
            let client_id = toUpdateTsCopy.id.split("/").shift()
            let folder_id = toUpdateTsCopy.id.split("/")[1]
            let ts_id = toUpdateTsCopy.id.split("/").pop()
            ApiBackService.delete_ts(client_id,folder_id,ts_id).then( res => {
                if(res.status === 200 && res.succes === true){
                    if(typeof toUpdateTs.price === "string") toUpdateTs.price = parseFloat(toUpdateTs.price)
                    console.log(toUpdateTs)
                    ApiBackService.add_ts(toUpdateTs.client,toUpdateTs.client_folder.split("/").pop(),toUpdateTs).then( res => {
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
                }else{
                    toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                }
                setLoading(false)
            }).catch( err => {
                toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            })
        },250)
    }

    const delete_ts = () => {
        setOpenDeleteModal(false)
        setLoading(true)
        let client_id = toUpdateTs.id.split("/").shift()
        let folder_id = toUpdateTs.id.split("/")[1]
        let ts_id = toUpdateTs.id.split("/").pop()
        ApiBackService.delete_ts(client_id,folder_id,ts_id).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateTs()
                setTsTableFirst(0)
                filter_timesheets(1,tsTableRows,tm_user_search.id || "false",
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

    const add_new_ts_modal = () => {
        setLoading(true)
        let folder_id = newTimeSheetInvoice.cl_folder.id.split("/").pop()
        let newItem = {
            date:moment(newTimeSheetInvoice.date).set({hour:moment().hour(),minute:moment().minute(),second:moment().second()}).unix(),
            client:newTimeSheetInvoice.client.id,
            client_folder:newTimeSheetInvoice.client.id + "/" + folder_id,
            user:newTimeSheetInvoice.user.id,
            desc:newTimeSheetInvoice.desc,
            duration:utilFunctions.durationToNumber(newTimeSheetInvoice.duration),
            price:newTimeSheetInvoice.user_price
        }
        if(typeof newItem.price === "string") newItem.price = parseFloat(newItem.price)
        ApiBackService.add_ts(newItem.client,folder_id,newItem).then(async res => {
            if(res && res.status === 200 && res.succes === true){
                console.log(res)
                clear_add_ts_modal_form()
                //setWaitInvoiceTimesheets(true)
                let invoice_data = newTsInvoiceData
                //let timesheet_cp = _.cloneDeep(newTsInvoiceData.timesheet)
                invoice_data.timesheet = newTsInvoiceData.timesheet.map( item => {return item.id.split("/").pop()})
                invoice_data.timesheet.push(res.data.id.split("/").pop())
                if(invoice_data.timesheet_copy) delete invoice_data.timesheet_copy
                invoice_data.fees = 'fees' in invoice_data ? invoice_data.fees.fees : 2
                if('reduction' in invoice_data){
                    if('percentage' in invoice_data.reduction){
                        invoice_data.reduction = {
                            percentage: invoice_data.reduction.percentage.amount
                        }
                    }
                    if('fix' in invoice_data.reduction){
                        invoice_data.reduction = {
                            fix: invoice_data.reduction.fix.amount
                        }
                    }
                }
                let update = await update_invoice(invoice_data.id,invoice_data)
                if(update && update !== "false"){
                    /*invoice_data.timesheet = timesheet_cp
                    let find_oa_user = oa_users.find(x => x.id === res.data.user)
                    invoice_data.timesheet.push({
                        date: res.data.date,
                        desc: res.data.desc,
                        duration: res.data.duration,
                        id: res.data.id,
                        price: res.data.price,
                        user: {
                            first_name: find_oa_user.first_name || "",
                            image: find_oa_user.image || "",
                            last_name: find_oa_user.last_name || ""
                        }
                    })*/
                    filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                        inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                        inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
                    )
                    /*ApiBackService.get_invoice(newItem.client,folder_id,invoice_data.id.split("/").pop()).then( invRes => {
                        console.log(invRes)
                        if(invRes.status === 200 && invRes.succes === true){
                            console.log("ENTRED***")
                            invoice_data.price.HT = invRes.data.price.HT
                            invoice_data.price.taxes = invRes.data.price.taxes
                            invoice_data.price.total = invRes.data.price.total
                            setNewTsInvoiceData()
                            setTimeout(() => {
                                setNewTsInvoiceData(invoice_data)
                            },100)
                        }else{
                            toast.warning("Une erreur est survenue, veuillez recharger la page")
                        }
                        }).catch(err => {
                        toast.warning("Une erreur est survenue, veuillez recharger la page")
                    })*/
                    setTsTableFirst(0)
                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                    toast.success("L'ajout du nouveau timeSheet est effectué avec succès !")
                    setLoading(false)
                }else{
                    toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                    setLoading(false)
                }
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

    const update_ts_from_invoice = () => {
        setOpenTsModal(false)
        setUpdateTsFromInvoice(false)
        setLoading(true)
        toUpdateTs.duration = utilFunctions.durationToNumber(toUpdateTs.duration)
        if(typeof toUpdateTs.price === "string") toUpdateTs.price = parseFloat(toUpdateTs.price)
        console.log(toUpdateTs)
        ApiBackService.update_ts(toUpdateTs,toUpdateTs.id.split("/").shift(),toUpdateTs.id.split("/")[1],toUpdateTs.id.split("/").pop()).then(async res => {
            if(res.status === 200 && res.succes === true){
                console.log(res)
                let invoice_data = newTsInvoiceData
                let find_tsInvoice_index = invoice_data.timesheet.findIndex(x => x.id === toUpdateTs.id)
                if(find_tsInvoice_index > -1){
                    setWaitInvoiceTimesheets(true)
                    let find_oa_user = oa_users.find(x => x.id === res.data.user)
                    invoice_data.timesheet[find_tsInvoice_index] = {
                        date: res.data.date,
                        desc: res.data.desc,
                        duration: res.data.duration,
                        id: res.data.id,
                        price: res.data.price,
                        user: {
                            first_name: find_oa_user.first_name || "",
                            image: find_oa_user.image || "",
                            last_name: find_oa_user.last_name || ""
                        }
                    }
                    ApiBackService.get_invoice(invoice_data.id.split("/").shift(), invoice_data.id.split("/")[1],invoice_data.id.split("/").pop()).then( invRes => {
                        if(invRes.status === 200 && invRes.succes === true){
                            invoice_data.price.HT = invRes.data.price.HT
                            invoice_data.price.taxes = invRes.data.price.taxes
                            invoice_data.price.total = invRes.data.price.total
                            setWaitInvoiceTimesheets(false)
                        }else{
                            setLoading(false)
                            toast.warning("Une erreur est survenue, veuillez recharger la page")
                        }
                    }).catch( err => {
                        setLoading(false)
                        toast.warning("Une erreur est survenue, veuillez recharger la page")
                    })
                }
                setToUpdateTs()
                toast.success("Modification effectuée avec succès !")
                setTsTableFirst(0)
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
    }

    const remove_ts_from_invoice = async (ts) => {
        setLoading(true)
        //setWaitInvoiceTimesheets(true)
        //let invoice_data = newTsInvoiceData
        let client_id = newTsInvoiceData.id.split("/").shift()
        let folder_id = newTsInvoiceData.id.split("/")[1]
        let bill_id = newTsInvoiceData.id.split("/").pop()

        let invoice_data = await get_details_invoice(client_id,folder_id,bill_id)
        invoice_data.timesheet = invoice_data.timesheet.filter(x => x.timesheet_id.split("/").pop() !== ts.id.split("/").pop())
        let timesheet_cp = _.cloneDeep(invoice_data.timesheet)
        invoice_data.timesheet = invoice_data.timesheet.map( item => {return item.timesheet_id.split("/").pop()})
        if(invoice_data.timesheet_copy) delete invoice_data.timesheet_copy
        invoice_data.fees = 'fees' in invoice_data ? invoice_data.fees.fees : 2
        if('reduction' in invoice_data){
            if('percentage' in invoice_data.reduction){
                invoice_data.reduction = {
                    percentage: invoice_data.reduction.percentage.amount
                }
            }
            if('fix' in invoice_data.reduction){
                invoice_data.reduction = {
                    fix: invoice_data.reduction.fix.amount
                }
            }
        }
        let update = await update_invoice(invoice_data.id,invoice_data)
        if(update && update !== "false"){
            setLoading(false)
            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
            )
            /*setTimeout(() => {
                invoice_data.timesheet = timesheet_cp
                setexpandedFactRows([invoice_data])
            },2500)*/
            /*invoice_data.timesheet = timesheet_cp
            ApiBackService.get_invoice(client_id,folder_id,bill_id).then( invRes => {
                if(invRes.status === 200 && invRes.succes === true){
                    invoice_data.price.HT = invRes.data.price.HT
                    invoice_data.price.taxes = invRes.data.price.taxes
                    invoice_data.price.total = invRes.data.price.total
                    setTimeout(() => {
                        setNewTsInvoiceData(invoice_data)
                        toast.success("Le timesheet a été retiré avec succès")
                    },100)
                }else{
                    setLoading(false)
                    toast.warning("Une erreur est survenue, veuillez recharger la page")
                }
            }).catch( err => {
                setLoading(false)
                toast.warning("Une erreur est survenue, veuillez recharger la page")
            })*/
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const delete_fact = () => {
        setOpenDeleteFactModal(false)
        setLoading(true)
        console.log(toUpdateFact)
        ApiBackService.delete_invoice(toUpdateFact.id.split("/").shift(),toUpdateFact.id.split("/")[1],toUpdateFact.id.split("/").pop()).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Suppression effectuée avec succès !")
                setToUpdateFact()
                setFactTableFirst(0)
                filter_invoices(1,factTableRows,inv_search_user.id || "false",
                    inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                    inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
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

    const create_invoice = (id,type,tva,partner,date,timesheets,lang,prov_client,prov_client_folder,prov_amount,prov_bank) => {
        //verif timesheets
        let verif = timesheets.filter(x => x.status > 0)
        if(verif.length > 0){
            toast.warning("Un ou plusieurs timesheets sont déjà utilisés dans une autre facture")
        }else {
            setLoading(true)
            let client_id = id.split("/").shift()
            let folder_id = id.split("/")[1]
            let data = {}
            let banq = []
            let address = []
            let selected_bank = oa_comptes_bank_factures.find(x => x.id === "1")
            let selected_pay_terms = payment_terms.find(x => x.id === "1")
            banq.push("Banque :" + selected_bank.title)
            banq.push("Bénéficiaire : OA Legal SA")
            banq.push("IBAN : <b>" + selected_bank.code + "</b>")
            banq.push("Clearing : " + selected_bank.clearing)
            banq.push("BIC/Swif : " + selected_bank.swift_bic)
            banq.push("REF. : <b>Facture #12345</b>")
            banq.push("Délai de paiement : " + selected_pay_terms.fr)
            let find_client = clients.find(x => x.id === timesheets[0].id.split("/").shift())
            console.log(find_client)
            if(find_client){
                address.push(projectFunctions.get_client_title(find_client))
                address.push(find_client.adresse.street)
                address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
            }
            else{
                address.push("")
                address.push("")
                address.push("")
            }
            data = {
                date:moment(date).set({hour:moment().hour(),minute:moment().minute(),second:moment().second()}).unix(),
                bill_type: type,
                TVA: 0,
                TVA_inc: false,
                timesheet: timesheets.map( item => {return item.id.split("/").pop()}),
                lang: lang,
                client:client_id,
                client_folder:client_id + "/" + folder_id,
                user:partner.id,
                banq:banq,
                address:address
            }
            console.log(data)
            ApiBackService.create_invoice(client_id,folder_id,data).then( res => {
                if(res.status === 200 && res.succes === true){
                    filter_invoices(1,factTableRows,"false","false", "false","false")
                    setTs_selected_rows()
                    setPartnerValidation("")
                    setInvoice_date(moment().format("YYYY-MM-DD"))
                    clear_search_form()
                    setShowBy({ label: 'Par TimeSheet', value: 'timesheet' })
                    toast.success("La création de la facture pour le client " + projectFunctions.get_client_title(find_client) + " est effectuée avec succès !")
                    setTimeout(() => {
                        setTabs(2)
                    },250)
                    setTsTableFirst(0)
                    filter_timesheets(1,tsTableRows,"false","false", "false")
                    filter_unused_timesheets(wip_client.id || "false",wip_client_folder.id ? wip_client_folder.id.split("/").pop() : "false")
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
    }

    const create_provision = (tva,date,prov_client,prov_client_folder,prov_amount,prov_bank) => {
        setLoading(true)
        let lang = prov_client.lang || "fr"
        let client_id = prov_client.id
        let folder_id = prov_client_folder.id.split("/").pop()
        let data = {}
        let banq = []
        let address = []
        let selected_bank = oa_comptes_bank_provision.find(x => x.id === prov_bank)
        lang === "fr" ? banq.push("<span style='margin-top: 40px;'>Bénéficiaire : <b>OA Legal SA</b></span>") :
            banq.push("<span style='margin-top: 40px;'>Beneficiary : <b>OA Legal SA</b></span>")
        lang === "fr" ? banq.push("Banque :" + selected_bank.title) :
            banq.push("Bank :" + selected_bank.title)
        banq.push("IBAN : <b>" + selected_bank.code + "</b>")
        banq.push("BIC/Swif : " + selected_bank.swift_bic)
        banq.push("Clearing : " + selected_bank.clearing)
        banq.push("Reference : " + projectFunctions.get_client_title(prov_client) + " - " + prov_client_folder.name)
        let find_client = clients.find(x => x.id === prov_client.id)
        console.log(find_client)
        if(find_client){
            lang === "fr" ? address.push("<b style='text-decoration: underline'>Par voie électronique</b>") :
                address.push("<b style='text-decoration: underline'>By email</b>")
            address.push(projectFunctions.get_client_title(find_client))
            address.push(find_client.adresse.street)
            address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(date).locale("en").format("MMMM, DD, YYYY"))
        }
        else{
            address.push("")
            address.push("")
            address.push("")
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(date).locale("en").format("MMMM, DD, YYYY"))
        }

        data = {
                date:moment(date).set({hour:moment().hour(),minute:moment().minute(),second:moment().second()}).unix(),
                bill_type: "provision",
                TVA: oa_taxs.find(x => x.id === tva)["value"],
                TVA_inc: oa_taxs.find(x => x.id === tva)["inclus"],
                lang: lang,
                client:client_id,
                client_folder:client_id + "/" + folder_id,
                prov_amount:parseFloat(prov_amount),
                prov_bank:oa_comptes_bank_factures.find(x => x.id === prov_bank),
                user:projectFunctions.get_user_id_by_email(oa_users,localStorage.getItem("email")),
                banq:banq,
                address:address
            }

        console.log(data)
        ApiBackService.create_invoice(client_id,folder_id,data).then( res => {
            if(res.status === 200 && res.succes === true){
                clear_add_ts_form()
                toast.success("La création de la provision pour le client " +
                    projectFunctions.get_client_title({name_1:find_client.name_1,name_2:find_client.name_2,type:find_client.type}) + " est effectuée avec succès !")
                setFactTableFirst(0)
                filter_invoices(1,factTableRows,"false","false", "false","false")
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

    const preview_provision = (tva,date,prov_client,prov_client_folder,prov_amount,prov_bank) => {
        setLoading(true)
        let lang = prov_client.lang || "fr"
        let client_id = prov_client.id
        let folder_id = prov_client_folder.id.split("/").pop()
        let data = {}
        let banq = []
        let address = []
        let selected_bank = oa_comptes_bank_provision.find(x => x.id === prov_bank)
        lang === "fr" ? banq.push("<span style='margin-top: 40px;'>Bénéficiaire : <b>OA Legal SA</b></span>") :
            banq.push("<span style='margin-top: 40px;'>Beneficiary : <b>OA Legal SA</b></span>")
        lang === "fr" ? banq.push("Banque :" + selected_bank.title) :
            banq.push("Bank :" + selected_bank.title)
        banq.push("IBAN : <b>" + selected_bank.code + "</b>")
        banq.push("BIC/Swif : " + selected_bank.swift_bic)
        banq.push("Clearing : " + selected_bank.clearing)
        banq.push("Reference : " + projectFunctions.get_client_title(prov_client) + " - " + prov_client_folder.name)
        let find_client = clients.find(x => x.id === prov_client.id)
        console.log(find_client)
        if(find_client){
            lang === "fr" ? address.push("<b style='text-decoration: underline'>Par voie électronique</b>") :
                address.push("<b style='text-decoration: underline'>By email</b>")
            address.push(projectFunctions.get_client_title(find_client))
            address.push(find_client.adresse.street)
            address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(date).locale("en").format("MMMM, DD, YYYY"))
        }
        else{
            address.push("")
            address.push("")
            address.push("")
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(date).locale("en").format("MMMM, DD, YYYY"))
        }

        data = {
            date:moment(date).set({hour:moment().hour(),minute:moment().minute(),second:moment().second()}).unix(),
            bill_type: "provision",
            TVA: oa_taxs.find(x => x.id === tva)["value"],
            TVA_inc: oa_taxs.find(x => x.id === tva)["inclus"],
            lang: lang,
            client:client_id,
            client_folder:client_id + "/" + folder_id,
            prov_amount:parseFloat(prov_amount),
            prov_bank:oa_comptes_bank_factures.find(x => x.id === prov_bank),
            user:projectFunctions.get_user_id_by_email(oa_users,localStorage.getItem("email")),
            banq:banq,
            address:address
        }

        ApiBackService.create_invoice(client_id,folder_id,data).then( async res => {
            console.log(res)
            if(res.status === 200 && res.succes === true){
                setTimeout(() => {
                    window.open("http://146.59.155.94:8083" + res.data.url,"_blank")
                    setLoading(false)
                    ApiBackService.delete_invoice(client_id,folder_id,res.data.id.split("/").pop()).then( delRes => {
                        if(delRes.status === 200 && delRes.succes === true){
                            console.log("PROVISION DELETED")
                        }
                    }).catch( err => console.log(err))
                },1000)
            }else{
                toast.error(res.error || "Une erreur est survenue, veuillez réessayer ultérieurement")
                setLoading(false)
            }
        }).catch( err => {
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        })
    }

    const get_details_ts = (client_id,folder_id,ts_id) => {
        return new Promise( resolve => {
            ApiBackService.get_timesheet(client_id,folder_id,ts_id).then( getRes => {
                if(getRes.status === 200 && getRes.succes === true){
                    resolve(getRes.data)
                }else{
                    console.log(getRes.error)
                    resolve("false")
                }
            }).catch( err => {
                resolve("false")
            })
        })
    }

    const get_details_invoice = (client_id,folder_id,bill_id) => {
        return new Promise( resolve => {
            ApiBackService.get_invoice(client_id,folder_id,bill_id).then( getRes => {
                if(getRes.status === 200 && getRes.succes === true){
                    resolve(getRes.data)
                }else{
                    console.log(getRes.error)
                    resolve("false")
                }
            }).catch( err => {
                resolve("false")
            })
        })
    }

    const update_invoice = (id,data) => {
        return new Promise( resolve => {
            ApiBackService.update_invoice(id.split("/").shift(),id.split("/")[1],id.split("/").pop(),data).then( updateRes => {
                if(updateRes.status === 200 && updateRes.succes === true){
                    resolve("true")
                }else{
                    console.log(updateRes.error)
                    resolve("false")
                }
            }).catch( err => {
                resolve("false")
            })
        })
    }

    const update_provision = async () => {
        setLoading(true)
        let cp = toUpdateFact
        cp.prov_amount = parseFloat(toUpdateFact.prov_amount)
        let find_client = clients.find(x => x.id === cp.id.split("/").shift())
        let lang = find_client ? (find_client.lang || "fr") : "fr"
        let banq = []
        let address = []
        let selected_bank = oa_comptes_bank_provision.find(x => x.id === cp.prov_bank.id)
        lang === "fr" ? banq.push("<span style='margin-top: 40px;'>Bénéficiaire : <b>OA Legal SA</b></span>") :
            banq.push("<span style='margin-top: 40px;'>Beneficiary : <b>OA Legal SA</b></span>")
        lang === "fr" ? banq.push("Banque :" + selected_bank.title) :
            banq.push("Bank :" + selected_bank.title)
        banq.push("IBAN : <b>" + selected_bank.code + "</b>")
        banq.push("BIC/Swif : " + selected_bank.swift_bic)
        banq.push("Clearing : " + selected_bank.clearing)
        find_client && banq.push("Reference : " + projectFunctions.get_client_title(find_client) + " - " + cp.client_folder.name)
        if(find_client){
            lang === "fr" ? address.push("<b style='text-decoration: underline'>Par voie électronique</b>") :
                address.push("<b style='text-decoration: underline'>By email</b>")
            address.push(projectFunctions.get_client_title(find_client))
            address.push(find_client.adresse.street)
            address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(cp.date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(cp.date).locale("en").format("MMMM, DD, YYYY"))
        }
        else{
            address.push("")
            address.push("")
            address.push("")
            address.push("")
            lang === "fr" ? address.push("Genève, le " + moment(cp.date).locale("fr").format("DD MMMM YYYY")):
                address.push("Geneva, " + moment(cp.date).locale("en").format("MMMM, DD, YYYY"))
        }
        cp.banq = banq
        cp.address = address
        cp.lang = lang
        let update = await update_invoice(cp.id,cp)
        if(update && update !== "false"){
            toast.success("La modification de la provision est effectuée avec succès !")
            filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
            )
            setLoading(false)
            setOpenFactModal(false)
        }else{
            setLoading(false)
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
        }
    }

    const validate_provision = (id,status) => {
        setLoading(true)
        console.log(status)
        ApiBackService.validate_invoice(id.split("/").shift(),id.split("/")[1],id.split("/").pop(),{status:status}).then( res => {
            console.log(res)
            if(res.status === 200 && res.succes === true){
                toast.success("La validation de cette provision est effectuée avec succès !")
                filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                    inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                    inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
                )
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

    const pay_invoice = (type,id,status) => {
        setLoading(true)
        ApiBackService.validate_invoice(id.split("/").shift(),id.split("/")[1],id.split("/").pop(),{status:status}).then( res => {
            if(res.status === 200 && res.succes === true){
                toast.success("Cette "+type+" est bien enregistrée comme payer !")
                filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                    inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                    inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
                )
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

    const update_validate_invoice = async (invoice,status) => {
        setLoading(true)
        let id = invoice.id
        let banq = []
        let address = []
        let selected_bank = oa_comptes_bank_factures.find(x => x.id === draft_invoice_bank)
        let selected_pay_terms = payment_terms.find(x => x.id === draft_invoice_paym_condition)
        banq.push("Banque :" + selected_bank.title)
        banq.push("Bénéficiaire : OA Legal SA")
        banq.push("IBAN : <b>" + selected_bank.code + "</b>")
        banq.push("Clearing : " + selected_bank.clearing)
        banq.push("BIC/Swif : " + selected_bank.swift_bic)
        banq.push("REF. : <b>Facture #12345</b>")
        banq.push("Délai de paiement : " + selected_pay_terms.fr)
        let find_client = clients.find(x => x.id === invoice.id.split("/").shift())
        console.log(find_client)
        find_client ? address.push(projectFunctions.get_client_title(find_client)) : address.push("")
        address.push(find_client.adresse.street)
        address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
        let data = {
            date:invoice.date,
            bill_type:invoice.bill_type,
            lang:invoice.lang || "fr",
            timesheet:invoice.timesheet.map( item => {return item.id.split("/").pop()}),
            TVA: oa_taxs.find(x => x.id === draft_invoice_taxe)["value"],
            TVA_inc: oa_taxs.find(x => x.id === draft_invoice_taxe)["inclus"],
            template_ts:draft_invoice_template,
            banq:banq,
            address:address,
            client:invoice.id.split("/").shift(),
            client_folder:invoice.id.split("/").shift() + "/" + invoice.id.split("/")[1],
            status:invoice.status,
            user:invoice.user
        }
        if(draft_invoice_fees === "0"){
            data.fees =oa_fees.find(x => x.id === draft_invoice_fees)["value"]
        }
        let reduction = {}
        if(!isNaN(parseFloat(draft_invoice_reduction)) || parseFloat(draft_invoice_reduction) > 0 ){
            if(draft_invoice_reduction_type === "percent"){
                reduction = {percentage:parseFloat(draft_invoice_reduction)}
                data.reduction = reduction
            }else{
                reduction = {fix:parseFloat(draft_invoice_reduction)}
                data.reduction = reduction
            }
        }
        if(invoiceSelectedProvisions && invoiceSelectedProvisions.length > 0){
            data.provisions = invoiceSelectedProvisions.map( item => {return item.id.split("/").pop()})
        }
        let update = await update_invoice(id,data)
        if(update && update !== "false"){
            console.log(data)
            ApiBackService.validate_invoice(id.split("/").shift(),id.split("/")[1],id.split("/").pop(),
                {status:status}).then( res => {
                if(res.status === 200 && res.succes === true){
                    toast.success("La validation des modifications sur cette facture est effectuée avec succès !")
                    setInvoiceSelectedProvisions()
                    setDraft_invoice_reduction("")
                    setexpandedFactRows()
                    filter_invoices(factTablePage,factTableRows,inv_search_user.id || "false",
                        inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",
                        inv_search_status !== -1 ? inv_search_status : "false","false","false","true"
                    )
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
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const update_preview_invoice = async (invoice,status) => {
        setLoading(true)
        let id = invoice.id
        let banq = []
        let address = []
        let selected_bank = oa_comptes_bank_factures.find(x => x.id === draft_invoice_bank)
        let selected_pay_terms = payment_terms.find(x => x.id === draft_invoice_paym_condition)
        banq.push("Banque :" + selected_bank.title)
        banq.push("Bénéficiaire : OA Legal SA")
        banq.push("IBAN : <b>" + selected_bank.code + "</b>")
        banq.push("Clearing : " + selected_bank.clearing)
        banq.push("BIC/Swif : " + selected_bank.swift_bic)
        banq.push("REF. : <b>Facture #12345</b>")
        banq.push("Délai de paiement : " + selected_pay_terms.fr)
        let find_client = clients.find(x => x.id === invoice.id.split("/").shift())
        console.log(find_client)
        find_client ? address.push(projectFunctions.get_client_title(find_client)) : address.push("")
        address.push(find_client.adresse.street)
        address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
        let data = {
            date:invoice.date,
            bill_type:invoice.bill_type,
            lang:invoice.lang || "fr",
            timesheet:invoice.timesheet.map( item => {return item.id.split("/").pop()}),
            TVA: oa_taxs.find(x => x.id === draft_invoice_taxe)["value"],
            TVA_inc: oa_taxs.find(x => x.id === draft_invoice_taxe)["inclus"],
            template_ts:draft_invoice_template,
            banq:banq,
            address:address,
            client:invoice.id.split("/").shift(),
            client_folder:invoice.id.split("/").shift() + "/" + invoice.id.split("/")[1],
            status:invoice.status,
            user:invoice.user
        }
        if(draft_invoice_fees === "0"){
            data.fees =oa_fees.find(x => x.id === draft_invoice_fees)["value"]
        }
        let reduction = {}
        if(!isNaN(parseFloat(draft_invoice_reduction)) || parseFloat(draft_invoice_reduction) > 0 ){
            if(draft_invoice_reduction_type === "percent"){
                reduction = {percentage:parseFloat(draft_invoice_reduction)}
                data.reduction = reduction
            }else{
                reduction = {fix:parseFloat(draft_invoice_reduction)}
                data.reduction = reduction
            }
        }
        if(invoiceSelectedProvisions && invoiceSelectedProvisions.length > 0){
            data.provisions = invoiceSelectedProvisions.map( item => {return item.id.split("/").pop()})
        }
        console.log(data)
        let update = await update_invoice(id,data)
        if(update && update !== "false"){
            setLoading(false)
            if('url' in invoice && invoice.url !== ""){
                window.open("http://146.59.155.94:8083" + invoice.url,"_blank")
            }else{
                toast.warn("Ce document n'est pas encore disponible")
            }
        }else{
            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
            setLoading(false)
        }
    }

    const renderDateTemplate = (rowData) => {
        return (
            <Typography color="black">{rowData.date ? moment.unix(rowData.date).format("DD/MM/YYYY") : ""}</Typography>
        );
    }

    const renderClientFolderTemplate = (rowData) => {
        return (
            <Typography color="black" className="ellipsis_text_2"
                        title={projectFunctions.get_client_title({name_1:rowData.name_1,name_2:rowData.name_2,type:rowData.type}) + " - " + rowData.name}
            >
                {projectFunctions.get_client_title({name_1:rowData.name_1,name_2:rowData.name_2,type:rowData.type}) + " - " + rowData.name}
            </Typography>
        );
    }

    const renderDescTemplate = (rowData) => {
        return (
            <Popup content={rowData.desc ? rowData.desc : ""} trigger={<Typography className="ellipsis_text_1" color="black">{rowData.desc ? rowData.desc : ""}</Typography>} />
        );
    }
    const renderUserTemplate = (rowData) => {
        return (
            <UserAvatar image={rowData.image} last_name={rowData.last_name} first_name={rowData.first_name} />
        );
    }
    const renderUserTsByFolderTemplate = (rowData) => {
        return (
            <UserAvatar image={rowData.image} last_name={rowData.last_name} first_name={rowData.first_name} />
        );
    }
    const renderUserFactTemplate = (rowData) => {
        return (
            rowData.user ? <UserAvatar image={rowData.user.image} last_name={rowData.user.last_name} first_name={rowData.user.first_name} /> : null
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
                            onClick={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if(rowData.status > 0){
                                    toast.warning("Opération interdite, ce timesheet est deja utilisé dans une autre facture")
                                }else{
                                    setLoading(true)
                                    let ts_data = await get_details_ts(rowData.id.split("/").shift(),rowData.id.split("/")[1],rowData.id.split("/").pop())
                                    if(ts_data && ts_data !== "false"){
                                        let ts_copy = _.cloneDeep(ts_data)
                                        setToUpdateTsCopy(ts_copy)
                                        setToUpdateTs(prevState => ({
                                            ...ts_data,
                                            "duration": utilFunctions.formatDuration(ts_data.duration.toString())
                                        }))
                                        get_update_client_folders(ts_data.client,"ts")
                                    }else{
                                        toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                    }
                                }
                            }}
                >
                    <EditOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if(rowData.status > 0){
                                    toast.warning("Opération interdite, ce timesheet est deja utilisé dans une autre facture")
                                }else{
                                    setToUpdateTs(rowData)
                                    setOpenDeleteModal(true)
                                }
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
                            onClick={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let ts_data = await get_details_ts(rowData.id.split("/").shift(),rowData.id.split("/")[1],rowData.id.split("/").pop())
                                let ts_copy = _.cloneDeep(ts_data)
                                setToUpdateTsCopy(ts_copy)
                                setUpdateTsFromInvoice(true)
                                setToUpdateTs(prevState => ({
                                    ...ts_data,
                                    "duration": utilFunctions.formatDuration(rowData.duration.toString())
                                }))
                                get_update_client_folders(ts_data.id.split("/").shift(),"ts")
                            }}
                >
                    <EditOutlinedIcon fontSize="small" color="default"/>
                </IconButton>
                <IconButton title="Supprimer" size="small" color="default" style={{marginLeft: "0.05rem"}}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if('timesheet' in newTsInvoiceData && newTsInvoiceData.timesheet.length === 1){
                                    toast.warning("Un timesheet par facture au minimum")
                                }else{
                                    setToUpdateTsInvoice(rowData)
                                    setOpenRemoveTsInvoiceModal(true)
                                }
                            }}
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        )
    }

    const tsFooterGroup = <ColumnGroup>
        <Row>
            <Column footer="Totales:"
                    colSpan={(tm_client_search !== "" && tm_client_folder_search !== "") ? 6 : 5} footerStyle={{textAlign: 'right'}}/>
            <Column footer={timehseets_sum ? timehseets_sum.duration : "---"} footerStyle={{textAlign: 'center'}} />
            <Column footer={timehseets_sum ? (timehseets_sum.price + " CHF") : "---CHF"} footerStyle={{textAlign: 'center'}}/>
            <Column footer={""}/>
        </Row>
    </ColumnGroup>

    const unusedTsFooterGroup = <ColumnGroup>
        <Row>
            <Column footer="Totales:"
                    colSpan={5} footerStyle={{textAlign: 'right'}}/>
            <Column footer={unusedTs_sum ? unusedTs_sum.duration : "---"} footerStyle={{textAlign: 'center'}} />
            <Column footer={unusedTs_sum ? (unusedTs_sum.price + " CHF") : "---CHF"} footerStyle={{textAlign: 'center'}}/>
            <Column footer={""}/>
        </Row>
    </ColumnGroup>

    const factFooterGroup = <ColumnGroup>
        <Row>
            <Column footer="Totales:" colSpan={5} footerStyle={{textAlign: 'right'}}/>
            <Column footer={bills_sum ? bills_sum.price_HT + " CHF" : ""} footerStyle={{textAlign: 'center'}}/>
            <Column footer={bills_sum ? bills_sum.price_TVA + " CHF" : ""} footerStyle={{textAlign: 'center'}} />
            <Column footer={bills_sum ? bills_sum.Price_TTC + " CHF" : ""}  footerStyle={{textAlign: 'center'}}/>
            <Column footer={""}/>
            <Column footer={""}/>
        </Row>
    </ColumnGroup>;

    const RenderTsByClientTemplate = (rowData) => {
        return(
            <div>
                <Typography>{projectFunctions.get_client_title({name_1:rowData.client.name_1,name_2:rowData.client.name_2,type:rowData.client.type})}</Typography>
            </div>
        );
    }

    const renderFolderTemplate = (rowData) => {
        return(
            <Typography title={rowData.name} className="ellipsis_text_2">{rowData.name}</Typography>
        );
    }

    const renderAssociesTemplate = (rowData) => {
        return(
            <div>
                <AvatarGroup max={3}>
                    {
                        (rowData.associates || []).map( (item,key) => (
                            key < 3 && <RenderUserAvatarImage size={35} image={item.details.image}
                                                              last_name={item.details.last_name} first_name={item.details.first_name}/>
                        ))
                    }
                    {
                        (rowData.associates || []).length > 3 &&
                        <Typography variant="subtitle2" color="grey" style={{textAlign:"center"}}>&nbsp;+ {rowData.associates.length - 3}</Typography>
                    }
                </AvatarGroup>
            </div>
        );
    }

    const renderUserInChargeTemplate = (rowData) => {
        return(
            <div>
                <UserAvatar image={rowData.user_in_charge.details.image} last_name={rowData.user_in_charge.details.last_name} first_name={rowData.user_in_charge.details.first_name}/>
            </div>
        );
    }
    const renderTotalHoursTemplate = (rowData) => {
        /*let total_hours = 0;
        (rowData.timesheets || []).map( item => {
            total_hours = total_hours + item.duration
        })*/
        return(
            <span className={"custom-tag status-info"}>{utilFunctions.formatDuration(rowData.sum.duration.toString())}</span>
        );
    }
    const renderTotalPriceTemplate = (rowData) => {
        /*let total_price = 0;
        (rowData.timesheets || []).map( item => {
            total_price = total_price + ((item.duration || 0) * (item.price || 0))
        })*/
        return(
            <span className={"custom-tag status-new"}>{rowData.sum.price.toFixed(2)}&nbsp;CHF</span>
        );
    }

    const rowExpansionTemplate = (data) => {
        console.log(data)
        return (
            <div className="tsByFolders-subtable">
                <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700,textDecoration:"underline"}}>
                    {(data.timesheets || []).length} timesheet non encore facturés</Typography>
                <div className="mt-2">
                    {
                        waitTsBy === true ?
                            <ShimmerTable row={(data.timesheets || []).length} col={7}/> :
                            <div>
                                    <DataTable value={data.timesheets} responsiveLayout="scroll" rowHover={true}
                                               emptyMessage="Aucun résultat trouvé"
                                               style={{borderColor: "#EDF2F7", borderWidth: 2, minHeight: "unset"}}>
                                        <Column header="Date" body={renderDateTemplate}></Column>
                                        <Column field="desc" header="Description" style={{color: "black"}}></Column>
                                        <Column header="Utilisateur" body={renderUserTsByFolderTemplate}></Column>
                                        <Column header="Taux horaire" body={renderPriceTemplate}></Column>
                                        <Column header="Durée" body={renderDurationTemplate}></Column>
                                        <Column header="Total" body={renderTotalTemplate}></Column>
                                    </DataTable>
                                    {(data.timesheets || []).length > 0 && renderConfirmInvoiceForm(data.timesheets[0].id,data.timesheets)}
                            </div>
                    }
                </div>

            </div>
        );
    }

    const renderConfirmInvoiceForm = (id,timesheets) => {
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
                                <div style={{display:"flex"}}>
                                    <div style={{alignSelf:"center",position:"absolute"}}>
                                        <img alt="" src={partnerValidation.image || userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                    </div>
                                    <TextField
                                        {...params}
                                        variant={"outlined"}
                                        value={partnerValidation || ""}
                                        inputProps={{
                                            ...params.inputProps,
                                            style:{
                                                alignSelf:"center",
                                                marginLeft:22
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
                                </div>
                            )}
                        />
                    </div>
                    <div className="col-lg-6 mb-1">
                        <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700}}>
                            Date de la facture
                        </Typography>
                        <TextField
                            type={"date"}
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
                <div className="mt-2">
                    <div style={{display:"flex",justifyContent:"right"}} className="mb-1">
                        <MuiButton variant="outlined" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   //disabled={partnerValidation === "" || invoice_date === ""}
                                   onClick={() => {
                                       setTs_selected_rows()
                                       setPartnerValidation("")
                                       setInvoice_date(moment().format("YYYY-MM-DD"))
                                       setExpandedTsByFolderRows()
                                   }}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800,marginLeft:15}}
                                   disabled={partnerValidation === "" || invoice_date === ""}
                                   onClick={() => {
                                       create_invoice(id,"invoice","false",partnerValidation,invoice_date,timesheets,"fr")
                                   }}
                        >
                            Envoyer facture pour validation
                        </MuiButton>
                    </div>

                </div>
            </div>
        )
    }


    const renderFactTypeTemplate = (rowData) => {
        return(
            <span className={"custom-tag status-info"}>{rowData.bill_type === "invoice" ? "Facture" : "Provision"}</span>
        );
    }
    const renderFactDateTemplate = (rowData) => {
        return(
            <Typography>{rowData.date ? moment.unix(rowData.date).format("DD-MM-YYYY") : ""}</Typography>
        );
    }
    const RenderFactClientTemplate = (rowData) => {
        return(
            <Typography>{projectFunctions.get_client_title({name_1:rowData.name_1,name_2:rowData.name_2,type:rowData.type})}</Typography>
        );
    }
    const renderFactFolderTemplate = (rowData) => {
        return(
            <Typography>{rowData.name}</Typography>
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
        let status_msg = ""
        let status_className = ""
        if(rowData.status === 0){
            status_msg = "En attente"
            status_className = "custom-tag status-warning"
        }else if(rowData.status === 1){
            status_msg = "Validé"
            status_className = "custom-tag status-success"
        }else if(rowData.status === 2){
            status_msg = "Payé"
            status_className = "custom-tag status-info"
        }
        return(
            <span className={status_className}>{status_msg}</span>
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

        const actionsMenu = []
        if(rowData.bill_type === "invoice" && rowData.status === 1){
            actionsMenu.push({
                icon:<PaidOutlinedIcon fontSize="small"/>,
                label:"Payer",
                onClick:() => {
                    setToUpdateFact(rowData)
                    setOpenPaymFactModal(true)
                }
            },{
                icon:<DeleteOutlineIcon fontSize="small"/>,
                label:"Supprimer",
                onClick:() => {
                    setToUpdateFact(rowData)
                    setOpenDeleteFactModal(true)
                }
            },)
        }
        if(rowData.bill_type === "provision" && rowData.status === 0){
            actionsMenu.push({
                    icon:<CheckBoxOutlinedIcon fontSize="small"/>,
                    label:"Valider",
                    onClick:() => {
                        setToUpdateFact(rowData)
                        setOpenValidateFactModal(true)
                    }
                },
                {
                    icon:<EditOutlinedIcon fontSize="small"/>,
                    label:"Modifier",
                    onClick:async () => {
                        setLoading(true)
                        let inv_data = await get_details_invoice(rowData.id.split("/").shift(),rowData.id.split("/")[1],rowData.id.split("/").pop())
                        setLoading(false)
                        if(inv_data && inv_data !== "false"){
                            setToUpdateFact(inv_data)
                            get_update_client_folders(rowData.id.split("/").shift(),"invoice")
                        }else{
                            toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                        }
                    }
                },
                {
                    icon:<DeleteOutlineIcon fontSize="small"/>,
                    label:"Supprimer",
                    onClick:() => {
                        setToUpdateFact(rowData)
                        setOpenDeleteFactModal(true)
                    }
                })
        }
        if(rowData.bill_type === "provision" && rowData.status === 1){
            actionsMenu.push({
                icon:<PaidOutlinedIcon fontSize="small"/>,
                label:"Payer",
                onClick:() => {
                    setToUpdateFact(rowData)
                    setOpenPaymFactModal(true)
                }
            },{
                icon:<EditOutlinedIcon fontSize="small"/>,
                label:"Modifier",
                onClick:async () => {
                    setLoading(true)
                    let inv_data = await get_details_invoice(rowData.id.split("/").shift(),rowData.id.split("/")[1],rowData.id.split("/").pop())
                    setLoading(false)
                    if(inv_data && inv_data !== "false"){
                        setToUpdateFact(inv_data)
                        get_update_client_folders(rowData.id.split("/").shift(),"invoice")
                    }else{
                        toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                    }
                }
            },{
                icon:<DeleteOutlineIcon fontSize="small"/>,
                label:"Supprimer",
                onClick:() => {
                    setToUpdateFact(rowData)
                    setOpenDeleteFactModal(true)
                }
            })
        }
        return (
            <div style={{display:"flex",justifyContent:"center"}}>
                {
                    ((rowData.bill_type === "invoice" && rowData.status > 0) || (rowData.bill_type === "provision")) &&
                    <IconButton title="Voir document" color="primary" size="small"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    console.log(rowData.url)
                                    if('url' in rowData && rowData.url !== null && rowData.url !== ""){
                                        window.open("http://146.59.155.94:8083" + rowData.url,"_blank")
                                    }else{
                                        toast.warn("Ce document n'est pas encore disponible")
                                    }
                                }}
                    >
                        <PlagiarismOutlinedIcon fontSize="medium" color="primary"/>
                    </IconButton>
                }
                {
                    ((rowData.bill_type === "invoice" && rowData.status === 1) || (rowData.bill_type === "provision" && rowData.status < 2)) &&

                    <div>
                        <div>
                            <IconButton title="Valider" size="small" color="default"
                                        data-toggle="collapse"
                                        role="button"
                                        aria-expanded="false"
                                        aria-controls={"collapseMenu"+ rowData.id.split("/").pop()}
                                        href={"#collapseMenu"+ rowData.id.split("/").pop()}
                            >
                                <MoreVertOutlinedIcon fontSize="medium" color="default"/>
                            </IconButton>
                        </div>
                        <div className={"collapse collapseMenu"+rowData.id.split("/").pop()}
                             id={"collapseMenu"+rowData.id.split("/").pop()}
                             style={{position: "absolute", zIndex: 1,marginLeft:-25}}
                        >
                            <div className="card text-left p-2" style={{boxShadow: "0 4px 10px 0 rgba(0,0,0,.15)"}}>
                                {
                                    actionsMenu.map((item,key) => (
                                        <div role="button" className="btnhover"
                                             onClick={() => {item.onClick()}}
                                        >
                                            <div style={{display:"flex",fontSize: 13, fontWeight: 600,paddingTop:3,paddingBottom:3}}>
                                                {item.icon}
                                                <Typography style={{marginLeft:5}}>{item.label}</Typography>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }

                {
                    rowData.bill_type === "invoice" && rowData.status === 0 &&
                    <IconButton title="Supprimer" size="small" color="danger" style={{marginLeft: "0.02rem"}}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setToUpdateFact(rowData)
                                    setOpenDeleteFactModal(true)
                                }}
                    >
                        <DeleteOutlineIcon fontSize="medium" color="default"/>
                    </IconButton>
                }
            </div>
        )
    }

    const rowExpansionFactTemplate = (data) => {
        return (
            <div className="tsByFolders-subtable">
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700,textDecoration:"underline",alignSelf:"center"}}>
                        {(data.timesheet || []).length} timesheet</Typography>
                    {
                        (data.status === 0 || data.status === 1) &&
                        <div style={{alignSelf: "center"}}>
                            <MuiButton color="primary"
                                       onClick={async () => {
                                           setLoading(true)
                                           let inv_data = await get_details_invoice(data.id.split("/").shift(),data.id.split("/")[1],data.id.split("/").pop())
                                           if(inv_data && inv_data !== "false"){
                                               inv_data.timesheet = data.timesheet
                                               setNewTsInvoiceData(inv_data)
                                               get_client_folders(data.id.split("/").shift(),"newTsModal",inv_data)
                                           }else{
                                               toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                           }
                                       }}
                                       startIcon={<AddIcon/>}
                                       style={{fontWeight: 700, alignSelf: "center", textTransform: "none"}}
                            >Ajouter un timesheet
                            </MuiButton>
                        </div>
                    }
                </div>

                <div className="mt-2">
                    {
                        waitInvoiceTimesheets === true ?
                            <ShimmerTable row={data.timesheet.length} col={7}  /> :
                            <div>
                                <DataTable value={data.timesheet || []}
                                           responsiveLayout="scroll" rowHover={true}
                                           sortField="date"
                                           sortOrder={-1}
                                           removableSort
                                           style={{borderColor:"#EDF2F7",borderWidth:2,minHeight:"unset"}}
                                >
                                    {
                                        (data.status === 0 || data.status === 1) &&
                                        <Column header="Actions" body={renderByFolderActionsTemplate} align="center"></Column>
                                    }
                                    <Column header="Date" body={renderDateTemplate} sortable sortField="date" align="center"></Column>
                                    <Column field="desc" header="Description" style={{color:"black"}}></Column>
                                    <Column header="Utilisateur" body={renderUserFactTemplate}></Column>
                                    <Column header="Taux horaire" body={renderPriceTemplate} align="center"></Column>
                                    <Column header="Durée" body={renderDurationTemplate} align="center"></Column>
                                    <Column header="Total" body={renderTotalTemplate} align="center"></Column>
                                </DataTable>
                                    {
                                        (data.status === 0 || data.status === 1) &&
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
                                                        {
                                                            fact_ts_templates.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
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
                                                        {
                                                            oa_comptes_bank_factures.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
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
                                                        {
                                                            payment_terms.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.fr}</MenuItem>
                                                            ))
                                                        }
                                                    </TextField>
                                                </div>
                                            </div>
                                            <div className="row mt-1">
                                                <div className="col-lg-4 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>TVA</Typography>
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
                                                        {
                                                            oa_taxs.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
                                                    </TextField>
                                                </div>
                                                <div className="col-lg-4 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Frais administratifs</Typography>
                                                    <TextField
                                                        select
                                                        type={"text"}
                                                        variant="outlined"
                                                        value={draft_invoice_fees}
                                                        onChange={(e) =>{
                                                            setDraft_invoice_fees(e.target.value)
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
                                                        {
                                                            oa_fees.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
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
                                            {
                                                invoiceProvisions && invoiceProvisions.length > 0 &&
                                                <div>
                                                    <div className="row mt-2">
                                                        <div className="col-lg-12 mb-1">
                                                            <Typography variant="subtitle1" color="primary" style={{fontSize: 14,fontWeight:700,marginBottom:7}}>Liste des provisions payées à appliquer à la facture:</Typography>
                                                            {
                                                                invoiceProvisions.map((item,key) => (
                                                                    <div>
                                                                        <FormControlLabel style={{marginBottom:-5}}
                                                                                          control={<Checkbox color="primary" defaultChecked={false}
                                                                                                             checked={item.checked || false}
                                                                                                             onChange={event => {
                                                                                                                 item.checked = event.target.checked
                                                                                                                 let checked_array = invoiceSelectedProvisions || []
                                                                                                                 if(item.checked === true){
                                                                                                                     checked_array.push(item)
                                                                                                                 }else checked_array = checked_array.filter(x => x.id !== item.id)
                                                                                                                 setInvoiceSelectedProvisions(checked_array)
                                                                                                                 console.log(checked_array)
                                                                                                                 setUpdateScreen(!updateScreen)
                                                                                                             }}
                                                                                          />}
                                                                                          labelPlacement="end"
                                                                                          label={"Provision de " + item.price.HT + " CHF payée le " + moment(item.created_at).format("DD-MM-YYYY")}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            <div style={{display:"flex",justifyContent:"right"}} className="mt-2">
                                                 <MuiButton variant="outlined" color="primary" size="medium"
                                                       style={{textTransform: "none", fontWeight: 800}}
                                                       onClick={() => {
                                                           update_preview_invoice(data)
                                                       }}
                                            >
                                                Preview
                                            </MuiButton>
                                                <MuiButton variant="contained" color="primary" size="medium"
                                                           style={{textTransform: "none", fontWeight: 800,marginLeft:15}}
                                                           disabled={draft_invoice_reduction !== "" && (isNaN(parseFloat(draft_invoice_reduction)) || parseFloat(draft_invoice_reduction) < 0 )}
                                                           onClick={() => {
                                                               update_validate_invoice(data,1)
                                                           }}
                                                >
                                                    Valider les changements sur la facture
                                                </MuiButton>
                                            </div>
                                        </div>
                                    }
                            </div>
                    }
                </div>

            </div>
        );
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text"
                                  onClick={() => {
                                      setLoading(true)
                                      filter_unused_timesheets(wip_client.id || "false",wip_client_folder.id ? wip_client_folder.id.split("/").pop() : "false")
                                  }}
    />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text"
                                   style={{display: "none"}}/>;

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
                                <Tab label="Timesheet" {...a11yProps(0)}/>
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
                                                        max:moment().format("YYYY-MM-DD")
                                                    }}
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
                                                    forcePopupIcon={true}
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
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
                                                            let find_user_in_folder = value.associate.find(x => x.id === newTimeSheet.user.id)
                                                            if(find_user_in_folder){
                                                                setNewTimeSheet(prevState => ({
                                                                    ...prevState,
                                                                    "user_price": find_user_in_folder.price
                                                                }))
                                                            }
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
                                                    {
                                                        newTimeSheet.duration !== "" && utilFunctions.verif_duration(newTimeSheet.duration) && !isNaN(parseFloat(newTimeSheet.user_price)) && parseFloat(newTimeSheet.user_price) > 0 &&
                                                        <Typography variant="subtitle1" color="primary"><b>Total:&nbsp;{(utilFunctions.durationToNumber(newTimeSheet.duration) * parseFloat(newTimeSheet.user_price)).toFixed(2)}&nbsp;CHF</b></Typography>
                                                    }
                                                </div>
                                            </div>
                                        }
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
                                                        {
                                                            oa_comptes_bank_provision.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
                                                    </TextField>
                                                </div>
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>TVA</Typography>
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
                                                        {
                                                            oa_taxs.map((item,key) => (
                                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                                            ))
                                                        }
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
                                                            <div style={{display:"flex"}}>
                                                                <div style={{alignSelf:"center",position:"absolute"}}>
                                                                    <img alt="" src={newTimeSheet.user ? newTimeSheet.user.image : userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                                                </div>
                                                                <TextField
                                                                    {...params}
                                                                    variant={"outlined"}
                                                                    value={newTimeSheet.user || ""}
                                                                    inputProps={{
                                                                        ...params.inputProps,
                                                                        style:{
                                                                            alignSelf:"center",
                                                                            marginLeft:22
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
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-lg-6 mb-1">
                                                    <Typography variant="subtitle1"
                                                                style={{fontSize: 14, color: "#616161"}}>Taux horaire</Typography>
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
                                                        Enregistrer
                                                    </MuiButton>
                                                </div>
                                                {/*<div>
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
                                                </div>*/}
                                               {/* <div>
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
                                                </div>*/}
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
                                                                   preview_provision(newTimeSheet.prov_tax,newTimeSheet.date,newTimeSheet.client,newTimeSheet.cl_folder,newTimeSheet.prov_amount,newTimeSheet.prov_bank)
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
                                                                   create_provision(newTimeSheet.prov_tax,newTimeSheet.date,newTimeSheet.client,newTimeSheet.cl_folder,newTimeSheet.prov_amount,newTimeSheet.prov_bank)
                                                               }}
                                                    >
                                                        Enregistrer la provision
                                                    </MuiButton>
                                                </div>
                                                {/*<div>
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
                                                </div>*/}
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
                                                        setTsTableFirst(0)
                                                        filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
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
                                    <div style={{width:150,marginTop:screenSize.width < 800 ? 5:-30}}>
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
                                                if(value.value === "timesheet") setTs_selected_rows()
                                                else{
                                                    if(!groupedTsByFolder){
                                                        filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                                                            tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                            "false","false")
                                                    }
                                                }
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
                                                                if(showBy.value === "timesheet"){
                                                                    setTsTableFirst(0)
                                                                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        moment(tm_edate_search).set({hour:23,minute:59,second:59}).unix(),moment(value).set({hour:0,minute:0,second:0}).unix())
                                                                }else{
                                                                    setTsByTableFirst(0)
                                                                    filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        moment(tm_edate_search).set({hour:23,minute:59,second:59}).unix(),moment(value).set({hour:0,minute:0,second:0}).unix())
                                                                }
                                                                setTm_sdate_search(value)
                                                            }else{
                                                                if(showBy.value === "timesheet"){
                                                                    setTsTableFirst(0)
                                                                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        "false",moment(value).set({hour:0,minute:0,second:0}).unix(),"false")
                                                                }else{
                                                                    setTsByTableFirst(0)
                                                                    filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        "false",moment(value).set({hour:0,minute:0,second:0}).unix(),"false")
                                                                }
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
                                                                if(showBy.value === "timesheet"){
                                                                    setTsTableFirst(0)
                                                                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false",
                                                                        moment(tm_sdate_search).set({hour:0,minute:0,second:0}).unix())
                                                                }else{
                                                                    setTsByTableFirst(0)
                                                                    filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false",
                                                                        moment(tm_sdate_search).set({hour:0,minute:0,second:0}).unix())
                                                                }
                                                                setTm_edate_search(value)
                                                            }else{
                                                                if(showBy.value === "timesheet"){
                                                                    setTsTableFirst(0)
                                                                    filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false","false","false")
                                                                }else{
                                                                    setTsByTableFirst(0)
                                                                    filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",
                                                                        tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false",
                                                                        value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false","false","false")
                                                                }
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
                                                           if(showBy.value === "timesheet"){
                                                               setTsTableFirst(0)
                                                               filter_timesheets(1,tsTableRows,"false","false", "false")
                                                           }else{
                                                               setTsByTableFirst(0)
                                                               filter_timesheets_by_folder(1,tsByTableRows,"false","false", "false")
                                                           }
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
                                            {
                                                showBy.value === "timesheet" ?
                                                    <div className="col-lg-4 mb-1">
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
                                                            value={tm_user_search || ""}
                                                            onChange={(event, value) => {
                                                                if(value){
                                                                    setTm_user_search(value)
                                                                }else{
                                                                    setTm_user_search("")
                                                                }
                                                                setTsTableFirst(0)
                                                                filter_timesheets(1,tsTableRows,value ? value.id : "false",tm_client_search.id || "false",tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                                                            }}
                                                            renderInput={(params) => (
                                                                <div style={{display:"flex"}}>
                                                                    <div style={{alignSelf:"center",position:"absolute"}}>
                                                                        <img alt="" src={tm_user_search.image || userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                                                    </div>
                                                                    <TextField
                                                                        {...params}
                                                                        variant={"outlined"}
                                                                        value={tm_user_search || ""}
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                            style:{
                                                                                alignSelf:"center",
                                                                                marginLeft:22
                                                                            },
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
                                                                </div>
                                                            )}
                                                        />
                                                    </div> :
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
                                                            value={tm_user_in_charge_search || ""}
                                                            onChange={(event, value) => {
                                                                setGroupedTsByFolder()
                                                                if(value){
                                                                    setTm_user_in_charge_search(value)
                                                                }else{
                                                                    setTm_user_in_charge_search("")
                                                                }
                                                                setTsByTableFirst(0)
                                                                filter_timesheets_by_folder(1,tsByTableRows,value ? value.id : "false",tm_client_search.id || "false",tm_client_folder_search.id ? tm_client_folder_search.id.split("/").pop() : "false")
                                                            }}
                                                            renderInput={(params) => (
                                                                <div style={{display:"flex"}}>
                                                                    <div style={{alignSelf:"center",position:"absolute"}}>
                                                                        <img alt="" src={tm_user_in_charge_search.image || userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                                                    </div>
                                                                    <TextField
                                                                        {...params}
                                                                        variant={"outlined"}
                                                                        value={tm_user_in_charge_search || ""}
                                                                        inputProps={{
                                                                            ...params.inputProps,
                                                                            style:{
                                                                                alignSelf:"center",
                                                                                marginLeft:22
                                                                            },
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
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                            }
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
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
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
                                                            setClient_folders()
                                                            if(showBy.value === "timesheet"){
                                                                setTsTableFirst(0)
                                                                filter_timesheets(1,tsTableRows,tm_user_search.id || "false","false","false")
                                                            }else{
                                                                setTsByTableFirst(0)
                                                                filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false","false","false")
                                                            }
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
                                                        if(showBy.value === "timesheet"){
                                                            setTsTableFirst(0)
                                                            filter_timesheets(1,tsTableRows,tm_user_search.id || "false",tm_client_search.id || "false",value ? value.id.split("/").pop() : "false")
                                                        }else{
                                                            setTsByTableFirst(0)
                                                            filter_timesheets_by_folder(1,tsByTableRows,tm_user_in_charge_search.id || "false",tm_client_search.id || "false",value ? value.id.split("/").pop() : "false")
                                                        }
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
                                                                       onRowClick={async (e) => {
                                                                           if(tm_client_search !== "" && tm_client_folder_search !== ""){

                                                                           }else{
                                                                               if(e.data.status > 0){
                                                                                   toast.warning("Opération interdite, ce timesheet est deja utilisé dans une autre facture")
                                                                               }else{
                                                                                   setLoading(true)
                                                                                   let ts_data = await get_details_ts(e.data.id.split("/").shift(),e.data.id.split("/")[1],e.data.id.split("/").pop())
                                                                                   if(ts_data && ts_data !== "false"){
                                                                                       let ts_copy = _.cloneDeep(ts_data)
                                                                                       setToUpdateTsCopy(ts_copy)
                                                                                       setToUpdateTs(prevState => ({
                                                                                           ...ts_data,
                                                                                           "duration": utilFunctions.formatDuration(ts_data.duration.toString())
                                                                                       }))
                                                                                       get_update_client_folders(ts_data.client,"ts")
                                                                                   }else{
                                                                                       toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                                                                   }
                                                                               }
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
                                                                       footerColumnGroup={tsFooterGroup}
                                                            >
                                                                {
                                                                    tm_client_search !== "" && tm_client_folder_search !== "" &&
                                                                    <Column selectionMode="multiple" ></Column>
                                                                }
                                                                <Column header="Date" sortable sortField="date" body={renderDateTemplate} align="center"></Column>
                                                                <Column header="Nom du dossier" body={renderClientFolderTemplate}></Column>
                                                                <Column header="Description"  body={renderDescTemplate}></Column>
                                                                <Column header="Utilisateur" body={renderUserTemplate}></Column>
                                                                <Column header="Taux horaire" body={renderPriceTemplate} align="center"></Column>
                                                                <Column header="Durée" sortable sortField="duration" body={renderDurationTemplate} align="center"></Column>
                                                                <Column header="Total" body={renderTotalTemplate} align="center"></Column>
                                                                {
                                                                    (!ts_selected_rows || ts_selected_rows.length === 0) &&
                                                                    <Column field="" header="Actions" body={renderActionsTemplate}></Column>
                                                                }

                                                            </DataTable>
                                                            <Paginator first={tsTableFirst} rows={tsTableRows}
                                                                       totalRecords={tsTableTotal}
                                                                       rowsPerPageOptions={[5, 10, 20, 30]}
                                                                       onPageChange={onTsTablePageChange}
                                                                       template={tsTableTemplate}
                                                            >
                                                            </Paginator>
                                                            {
                                                                ts_selected_rows && ts_selected_rows.length > 0 &&
                                                                renderConfirmInvoiceForm(ts_selected_rows[0].id,ts_selected_rows)
                                                            }
                                                        </div> :
                                                        <div>
                                                            {
                                                                !groupedTsByFolder ?
                                                                    <ShimmerTable row={3} col={4} size={"sm"}/> :
                                                                    <div>
                                                                        <DataTable value={groupedTsByFolder}
                                                                                   expandedRows={expandedTsByFolderRows}

                                                                                   onRowToggle={(e) => {
                                                                                       if(e.data.length > 1){
                                                                                           setExpandedTsByFolderRows([e.data[1]])
                                                                                       }else{
                                                                                           setExpandedTsByFolderRows(e.data)
                                                                                       }
                                                                                   }}
                                                                                   onRowExpand={(e) => {
                                                                                       console.log(e.data)
                                                                                       /*setPartnerValidation("")
                                                                                       setInvoice_date("")*/
                                                                                       //setWaitTsBy(true)
                                                                                       /*projectFunctions.get_timesheet_array_detail(e.data.id.split("/").shift(),e.data.id.split("/").pop(),e.data.timesheets || []).then( async res => {
                                                                                           let newData = e.data
                                                                                           newData.timesheet_copy = e.data.timesheets
                                                                                           newData.timesheets = res
                                                                                           setUpdateScreen(!updateScreen)
                                                                                           setWaitTsBy(false)
                                                                                       }).catch( err => {
                                                                                           console.log(err)
                                                                                           toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                                                                       })*/
                                                                                   }}
                                                                                   rowExpansionTemplate={rowExpansionTemplate}
                                                                                   rows={tsByTableRows}
                                                                                   removableSort={true}
                                                                                   size="small"
                                                                                   emptyMessage="Aucun résultat trouvé"
                                                                                   //footerColumnGroup={tsFooterGroup}
                                                                        >
                                                                            <Column expander/>
                                                                            <Column header="Client"
                                                                                    body={RenderTsByClientTemplate}></Column>
                                                                            <Column header="Dossier"
                                                                                    body={renderFolderTemplate}></Column>
                                                                            <Column
                                                                                header="Utilisateur en charge de dossier"
                                                                                body={renderUserInChargeTemplate}></Column>
                                                                            <Column header="Utilisateurs"
                                                                                    body={renderAssociesTemplate}></Column>
                                                                            <Column header="Total(h)"
                                                                                    body={renderTotalHoursTemplate}></Column>
                                                                            <Column header="Total(CHF)"
                                                                                    body={renderTotalPriceTemplate}></Column>
                                                                        </DataTable>
                                                                        <Paginator first={tsByTableFirst}
                                                                                   rows={tsByTableRows}
                                                                                   totalRecords={tsByTableTotal}
                                                                                   rowsPerPageOptions={[5, 10, 20, 30]}
                                                                                   onPageChange={onTsByTablePageChange}
                                                                                   template={tsByTableTemplate}
                                                                        >
                                                                        </Paginator>
                                                                    </div>
                                                            }
                                                        </div>
                                                }
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
                                                           setFactTableFirst(0)
                                                           filter_invoices(1,factTableRows,"false","false", "false","false","false","false")
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
                                                                        setFactTableFirst(0)
                                                                        if(inv_search_date2 !== ""){
                                                                            filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false",
                                                                                moment(inv_search_date2).set({hour:23,minute:59,second:59}).unix(),value !== "" ? moment(value).set({hour:0,minute:0,second:0}).unix() : "false")
                                                                        }else{
                                                                            filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false",
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
                                                                        setFactTableFirst(0)
                                                                        if(inv_search_date1 !== ""){
                                                                            filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false",
                                                                                value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false",
                                                                                moment(inv_search_date1).set({hour:0,minute:0,second:0}).unix())
                                                                            setInv_search_date2(value)
                                                                        }else{
                                                                            filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                                                inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false",
                                                                                value !== "" ? moment(value).set({hour:23,minute:59,second:59}).unix() : "false","false","false")
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
                                                        setFactTableFirst(0)
                                                        filter_invoices(1,factTableRows,value ? value.id : "false",inv_search_client.id || "false",inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false","false","false","true")
                                                    }}
                                                    renderInput={(params) => (
                                                        <div style={{display:"flex"}}>
                                                            <div style={{alignSelf:"center",position:"absolute"}}>
                                                                <img alt="" src={inv_search_user.image || userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                                            </div>
                                                            <TextField
                                                                {...params}
                                                                variant={"outlined"}
                                                                value={inv_search_user || ""}
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    style:{
                                                                        alignSelf:"center",
                                                                        marginLeft:22
                                                                    },
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
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-lg-3 mb-1">
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                                <Autocomplete
                                                    autoHighlight={true}
                                                    size="small"
                                                    options={clients || []}
                                                    noOptionsText={"Aucun client trouvé"}
                                                    getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                                    loading={!clients}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
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
                                                            setFactTableFirst(0)
                                                            filter_invoices(1,factTableRows,inv_search_user.id || "false","false","false",inv_search_status !== -1 ? inv_search_status : "false","false","false","true")
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
                                                        setFactTableFirst(0)
                                                        filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",value ? value.id.split("/").pop() : "false",inv_search_status !== -1 ? inv_search_status : "false","false","false","true")
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
                                                <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Statut</Typography>
                                                <TextField
                                                    select
                                                    type={"text"}
                                                    variant="outlined"
                                                    value={inv_search_status}
                                                    onChange={(e) => {
                                                        let value = e.target.value
                                                        console.log(value)
                                                        setInv_search_status(value)
                                                        setFactTableFirst(0)
                                                        filter_invoices(1,factTableRows,inv_search_user.id || "false",inv_search_client.id || "false",
                                                            inv_search_client_folder.id ? inv_search_client_folder.id.split("/").pop() : "false",value > -1 ? value : "false","false","false","true")
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
                                                           if(e.data.length > 1){
                                                               setexpandedFactRows([e.data[1]])
                                                           }else{
                                                               setexpandedFactRows(e.data)
                                                           }
                                                       }}
                                                       onRowExpand={async (e) => {
                                                           setDraft_invoice_reduction("")
                                                           setDraft_invoice_reduction_type("percent")
                                                           setWaitInvoiceTimesheets(true)
                                                           setNewTsInvoiceData(e.data)
                                                           let client_id = e.data.id.split("/").shift()
                                                           let folder_id = e.data.id.split("/")["1"]
                                                           let invoice_provisions = await get_client_folder_provisions(client_id,folder_id)
                                                           console.log(invoice_provisions)
                                                           setWaitInvoiceTimesheets(false)
                                                           if(invoice_provisions && invoice_provisions !== "false"){
                                                               setInvoiceProvisions(invoice_provisions.map( item => {return {...item,checked:true}}))
                                                               let selected_provisions = invoice_provisions.map( item => {
                                                                   return {...item,checked: true}
                                                               })
                                                               setInvoiceSelectedProvisions(selected_provisions)
                                                           }
                                                           /*projectFunctions.get_timesheet_array_detail(client_id,folder_id,e.data.timesheet).then( async res => {
                                                               let invoice_provisions = await get_client_folder_provisions(client_id,folder_id)
                                                               if(invoice_provisions && invoice_provisions !== "false"){
                                                                   setInvoiceProvisions(invoice_provisions.map( item => {return {...item,checked:true}}))
                                                                   let selected_provisions = invoice_provisions.map( item => {
                                                                       return {...item,checked: true}
                                                                   })
                                                                   setInvoiceSelectedProvisions(selected_provisions)
                                                               }
                                                               let newData = e.data
                                                               newData.timesheet_copy = e.data.timesheet
                                                               newData.timesheet = res
                                                               setNewTsInvoiceData(newData)
                                                               setUpdateScreen(!updateScreen)
                                                               setWaitInvoiceTimesheets(false)
                                                           }).catch( err => {
                                                               console.log(err)
                                                               toast.error("Une erreur est survenue, veuillez réessayer ultérieurement")
                                                           })*/
                                                       }}
                                                       rowExpansionTemplate={rowExpansionFactTemplate}
                                                       responsiveLayout="scroll"
                                                       sortField="date"
                                                       sortOrder={-1}
                                                       removableSort={true}
                                                       sortMode="single"
                                                       size="small"
                                                       emptyMessage="Aucun résultat trouvé"
                                                       footerColumnGroup={factFooterGroup}
                                            >
                                                <Column expander={allowFactExpansion}/>
                                                <Column header="Type" body={renderFactTypeTemplate}></Column>
                                                <Column header="Date" body={renderFactDateTemplate} sortable sortField="date"></Column>
                                                <Column header="Client" body={RenderFactClientTemplate} align="center"></Column>
                                                <Column header="Dossier" body={renderFactFolderTemplate} align="center"></Column>
                                                <Column header="Montant HT" align="center" body={renderFactTotatHtTemplate}></Column>
                                                <Column header="TVA" align="center" body={renderFactTaxeTemplate}></Column>
                                                <Column header="Total" align="center" body={renderFactTotalTemplate}></Column>
                                                <Column header="Statut" align="center" body={renderFactStatusTemplate}></Column>
                                                {/*<Column header="Paiement" align="center" body={renderFactPaymentTemplate}></Column>*/}
                                                <Column header="Actions" body={renderFactActionsTemplate} align="center"></Column>
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
                                <div>
                                    <div className="mt-2">
                                        <div style={{display: "flex", cursor: "pointer"}}>
                                            <SearchOutlinedIcon color="primary" style={{alignSelf: "center"}}/>
                                                <Typography variant="subtitle1"
                                                            style={{fontWeight: 700, alignSelf: "center", marginLeft: 5}}
                                                            color="primary">Chercher par dossier client
                                                </Typography>
                                            </div>

                                        <div className="row mt-2">
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
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                                                            {
                                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                            }
                                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                        </Box>
                                                    )}
                                                    value={wip_client || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setWip_client(value || "")
                                                            setWip_client_folder("")
                                                            get_client_folders(value.id,"wip")
                                                        }else{
                                                            filter_unused_timesheets("false","false")
                                                            setWip_client_folders()
                                                            setWip_client("")
                                                            setWip_client_folder("")
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={wip_client || ""}
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
                                                    options={wip_client_folders || []}
                                                    noOptionsText={"Aucun dossier trouvé"}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    loading={wip_client_folder !== "" && !wip_client_folders}
                                                    loadingText="Chargement en cours..."
                                                    renderOption={(props, option) => (
                                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                            {
                                                                <FolderOpenOutlinedIcon color={"primary"}/>
                                                            }
                                                            &nbsp;&nbsp;{option.name || ""}
                                                        </Box>
                                                    )}
                                                    value={wip_client_folder || ""}
                                                    onChange={(event, value) => {
                                                        if(value){
                                                            setWip_client_folder(value)
                                                            filter_unused_timesheets(wip_client.id || "false",value.id ? value.id.split("/").pop() : "false")
                                                        }else{
                                                            setWip_client_folder("")
                                                            filter_unused_timesheets(wip_client.id || "false","false")
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            value={wip_client_folder || ""}
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
                                            wip_client_folder !== "" && wip_client_folder !== "" &&
                                            <div className="mt-1">
                                                {
                                                    !unusedTimesheets ?
                                                        <ShimmerTable row={4} col={7} size={"sm"}/> :
                                                        <div>
                                                            <div className="mt-3">
                                                                <DataTable value={unusedTimesheets}
                                                                           rowHover={true}
                                                                           paginator
                                                                           paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                                                           currentPageReportTemplate="Montrant {first} à {last} sur {totalRecords}"
                                                                           rows={5} rowsPerPageOptions={[5, 10, 20, 50,100,1000]}
                                                                           paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                                                                           dataKey="id"
                                                                           sortField="date"
                                                                           sortOrder={-1}
                                                                           removableSort={true}
                                                                           sortMode="single"
                                                                           size="small"
                                                                           emptyMessage="Aucun résultat trouvé"
                                                                           footerColumnGroup={unusedTsFooterGroup}
                                                                >
                                                                    <Column header="Date" sortable sortField="date" body={renderDateTemplate} align="center"></Column>
                                                                    <Column header="Nom du dossier" body={renderClientFolderTemplate}></Column>
                                                                    <Column field="desc" header="Description" style={{color:"black"}}></Column>
                                                                    <Column header="Utilisateur" body={renderUserTemplate}></Column>
                                                                    <Column header="Taux horaire" body={renderPriceTemplate} align="center"></Column>
                                                                    <Column header="Durée" sortable sortField="duration" body={renderDurationTemplate} align="center"></Column>
                                                                    <Column header="Total" body={renderTotalTemplate} align="center"></Column>
                                                                </DataTable>
                                                            </div>
                                                        </div>

                                                }
                                            </div>
                                        }

                                    </div>
                                </div>
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
                                setUpdateTsFromInvoice(false)
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
                                            type={"date"}
                                            variant="outlined"
                                            value={toUpdateTs.date ? moment.unix(toUpdateTs.date).format("YYYY-MM-DD") : ""}
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
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                                                    {
                                                        option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                    }
                                                    &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                                </Box>
                                            )}
                                            value={(clients || []).find(x => x.id === toUpdateTs.client) || ""}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client": value.id,
                                                        "client_folder": ""
                                                    }))
                                                    setUpdate_client_folders()
                                                    get_update_client_folders_after(value.id,"ts")
                                                }else{
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client": "",
                                                        "client_folder": ""
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant={"outlined"}
                                                    value={toUpdateTs.client || ""}
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
                                            disabled={updateTsFromInvoice === true}
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
                                            value={(update_client_folders || []).find(x => x.id === toUpdateTs.client_folder) || ""}
                                            onChange={(event, value) => {
                                                if(value){
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client_folder": value.id
                                                    }))
                                                }else{
                                                    setToUpdateTs(prevState => ({
                                                        ...prevState,
                                                        "client_folder": ""
                                                    }))
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant={"outlined"}
                                                    value={toUpdateTs.client_folder || ""}
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
                                            disabled={updateTsFromInvoice === true}
                                        />
                                    </div>

                                </div>
                            <div className="row mt-1">
                                    <div className="col-lg-12 mb-1">
                                        <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>
                                            Description&nbsp;<b>{toUpdateTs.lang !== "" ? (toUpdateTs.lang === "fr" ? "(Français)" : "(Anglais)") : ""}</b>
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
                                                <div style={{display:"flex"}}>
                                                    <div style={{alignSelf:"center",position:"absolute"}}>
                                                        <img alt="" src={(oa_users || []).find(x => x.id === toUpdateTs.user) ? (oa_users || []).find(x => x.id === toUpdateTs.user)["image"] : userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                                    </div>
                                                    <TextField
                                                        {...params}
                                                        variant={"outlined"}
                                                        value={toUpdateTs.user || ""}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            style:{
                                                                alignSelf:"center",
                                                                marginLeft:22
                                                            },
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
                                                </div>
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
                                setUpdateTsFromInvoice(false)
                                setOpenTsModal(false)
                            }}
                            color="primary"
                            variant="outlined"
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton
                            disabled={toUpdateTs.date === ""  || toUpdateTs.client_folder === "" || toUpdateTs.user === "" || toUpdateTs.client === ""
                                || !utilFunctions.verif_duration(toUpdateTs.duration)
                                 || isNaN(parseFloat(toUpdateTs.price)) || parseFloat(toUpdateTs.price) < 0 }
                            onClick={() => {
                                if(updateTsFromInvoice === true){
                                    update_ts_from_invoice()
                                }else{
                                    update_ts()
                                }

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

            {
                toUpdateFact &&
                <Dialog
                    open={openFactModal}
                    aria-labelledby="form-dialog-title"
                    fullWidth={"md"}
                    style={{zIndex: 100}}

                >
                    <DialogTitle disableTypography id="form-dialog-title">
                        <Typography variant="h6" color="primary" style={{fontWeight:700}}>Modifier provision</Typography>
                        <IconButton
                            aria-label="close"
                            style={{
                                position: 'absolute',
                                right: 5,
                                top: 5,
                                color: '#000'
                            }}
                            onClick={() => {
                                setOpenFactModal(false)
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
                                        type={"date"}
                                        variant="outlined"
                                        value={toUpdateFact.date ? moment.unix(toUpdateFact.date).format("YYYY-MM-DD") : ""}
                                        onChange={(e) =>{
                                            setToUpdateFact(prevState => ({
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
                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Compte bancaire</Typography>
                                    <TextField
                                        select
                                        type={"text"}
                                        variant="outlined"
                                        value={toUpdateFact.prov_bank ? toUpdateFact.prov_bank.id : ""}
                                        onChange={(e) =>{
                                            setToUpdateFact(prevState => ({
                                                ...prevState,
                                                "prov_bank": oa_comptes_bank_provision.find(x => x.id === e.target.value)
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
                                        {
                                            oa_comptes_bank_provision.map((item,key) => (
                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Client</Typography>
                                    <Autocomplete
                                        disabled={true}
                                        autoComplete={false}
                                        autoHighlight={false}
                                        size="small"
                                        options={clients || []}
                                        noOptionsText={"Aucun client trouvé"}
                                        getOptionLabel={(option) => option.type === 0 ? (option.name_2 || "") : ((option.name_2 || "") + ((option.name_1 && option.name_1.trim() !== "") ? (" " + option.name_1) : ""))}
                                        loading={!clients}
                                        loadingText="Chargement en cours..."
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                                                {
                                                    option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                                }
                                                &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                            </Box>
                                        )}
                                        value={(clients || []).find(x => toUpdateFact.id && x.id === toUpdateFact.id.split("/").shift()) || ""}
                                        onChange={(event, value) => {
                                            if(value){
                                                setToUpdateFact(prevState => ({
                                                    ...prevState,
                                                    "client": value.id,
                                                    "client_folder": ""
                                                }))
                                                setUpdate_client_folders()
                                                get_update_client_folders_after(value.id,"invoice")
                                            }else{
                                                setToUpdateFact(prevState => ({
                                                    ...prevState,
                                                    "client": "",
                                                    "client_folder": ""
                                                }))
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                value={toUpdateFact.client || ""}
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
                                        disabled={true}
                                        autoComplete={false}
                                        autoHighlight={false}
                                        size="small"
                                        options={update_client_folders || []}
                                        noOptionsText={"Aucun dossier trouvé"}
                                        getOptionLabel={(option) => option.name || ""}
                                        loading={toUpdateFact.client !== "" && !update_client_folders}
                                        loadingText="Chargement en cours..."
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                {
                                                    <FolderOpenOutlinedIcon color={"primary"}/>
                                                }
                                                &nbsp;&nbsp;{option.name || ""}
                                            </Box>
                                        )}
                                        value={(update_client_folders || []).find(x => x.id.split("/").pop() === toUpdateFact.id.split("/")[1]) || ""}
                                        onChange={(event, value) => {
                                            if(value){
                                                setToUpdateFact(prevState => ({
                                                    ...prevState,
                                                    "client_folder": value.id
                                                }))
                                            }else{
                                                setToUpdateFact(prevState => ({
                                                    ...prevState,
                                                    "client_folder": ""
                                                }))
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                value={toUpdateFact.client_folder || ""}
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
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>Montant</Typography>
                                    <TextField
                                        type={"number"}
                                        variant="outlined"
                                        value={toUpdateFact.prov_amount}
                                        onChange={(e) =>{
                                            setToUpdateFact(prevState => ({
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
                                            endAdornment: <InputAdornment
                                                position="end">CHF/h</InputAdornment>,
                                        }}
                                    />
                                </div>
                                <div className="col-lg-6 mb-1">
                                    <Typography variant="subtitle1" style={{fontSize: 14, color: "#616161"}}>TVA</Typography>
                                    <TextField
                                        select
                                        type={"text"}
                                        variant="outlined"
                                        value={toUpdateFact.TVA === 7.7 ? "0": "1"}
                                        onChange={(e) =>{
                                            setToUpdateFact(prevState => ({
                                                ...prevState,
                                                "TVA": oa_taxs.find(x => x.id === e.target.value)["value"]
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
                                        {
                                            oa_taxs.map((item,key) => (
                                                <MenuItem key={key} value={item.id}>{item.label}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                        <MuiButton
                            onClick={() => {
                                setOpenFactModal(false)
                            }}
                            color="primary"
                            variant="outlined"
                            style={{textTransform: 'capitalize', fontWeight: 700}}
                        >
                            Annuler
                        </MuiButton>
                        <MuiButton
                            disabled={toUpdateFact.date === ""  || toUpdateFact.client_folder === "" || toUpdateFact.client === ""
                                || isNaN(parseFloat(toUpdateFact.prov_amount)) || parseFloat(toUpdateFact.prov_amount) < 0 }
                            onClick={ () => {
                                setOpenFactModal(false)
                                update_provision()
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

            <Dialog
                open={openNewTsInvoiceModal}
                aria-labelledby="form-dialog-title"
                fullWidth={"md"}
                style={{zIndex: 100}}

            >
                <DialogTitle disableTypography id="form-dialog-title">
                    <Typography variant="h6" color="primary" style={{fontWeight:700}}>Ajouter TimeSheet</Typography>
                    <IconButton
                        aria-label="close"
                        style={{
                            position: 'absolute',
                            right: 5,
                            top: 5,
                            color: '#000'
                        }}
                        onClick={() => {
                            setOpenNewTsInvoiceModal(false)
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
                                    type={"date"}
                                    variant="outlined"
                                    value={newTimeSheetInvoice.date}
                                    onChange={(e) =>{
                                        console.log(e.target.value)
                                        setNewTimeSheetInvoice(prevState => ({
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
                                        max:moment().format("YYYY-MM-DD")
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
                                    value={newTimeSheetInvoice.duration || ""}
                                    onChange={(event, value) => {
                                        console.log(value)
                                        setNewTimeSheetInvoice(prevState => ({
                                            ...prevState,
                                            "duration": value ? (value || "") : ""
                                        }))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant={"outlined"}
                                            value={newTimeSheetInvoice.duration}
                                            error={newTimeSheetInvoice.duration !== "" && !utilFunctions.verif_duration(newTimeSheetInvoice.duration)}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                placeholder:"Format: --h--",
                                                onChange:(e) => {
                                                    console.log(e.target.value)
                                                    setNewTimeSheetInvoice(prevState => ({
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
                                    newTimeSheetInvoice.duration !== "" && !utilFunctions.verif_duration(newTimeSheetInvoice.duration) &&
                                    <Typography variant="subtitle1" color="error">Format invalide, Veuillez utiliser le format --h--</Typography>
                                }
                                {
                                    newTimeSheetInvoice.duration !== "" && utilFunctions.verif_duration(newTimeSheetInvoice.duration) && !isNaN(parseFloat(newTimeSheetInvoice.user_price)) && parseFloat(newTimeSheetInvoice.user_price) > 0 &&
                                    <Typography variant="subtitle1" color="primary"><b>Total:&nbsp;{(utilFunctions.durationToNumber(newTimeSheetInvoice.duration) * parseFloat(newTimeSheetInvoice.user_price)).toFixed(2)}&nbsp;CHF</b></Typography>
                                }
                            </div>
                        </div>
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
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                                            {
                                                option.type === 0 ? <BusinessOutlinedIcon color="primary"/> : <PersonOutlineOutlinedIcon color="primary"/>
                                            }
                                            &nbsp;&nbsp;{projectFunctions.get_client_title(option)}
                                        </Box>
                                    )}
                                    filterOptions={filterOptions}
                                    value={newTimeSheetInvoice.client || ""}
                                    onChange={(event, value) => {
                                        if(value){
                                            setNewTimeSheetInvoice(prevState => ({
                                                ...prevState,
                                                "client": value,
                                                "cl_folder": ""
                                            }))
                                            get_client_folders(value.id,"newTsModal")
                                        }else{
                                            setNewTimeSheetInvoice(prevState => ({
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
                                            value={newTimeSheetInvoice.client || ""}
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
                                    disabled={true}
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
                                    loading={newTimeSheetInvoice.client !== "" && !client_folders}
                                    loadingText="Chargement en cours..."
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {
                                                <FolderOpenOutlinedIcon color={"primary"}/>
                                            }
                                            &nbsp;&nbsp;{option.name || ""}
                                        </Box>
                                    )}
                                    value={newTimeSheetInvoice.cl_folder || ""}
                                    onChange={(event, value) => {
                                        if(value){
                                            setNewTimeSheetInvoice(prevState => ({
                                                ...prevState,
                                                "cl_folder": value
                                            }))
                                            let find_user_in_folder = value.associate.find(x => x.id === newTimeSheetInvoice.user.id)
                                            if(find_user_in_folder){
                                                setNewTimeSheetInvoice(prevState => ({
                                                    ...prevState,
                                                    "user_price": find_user_in_folder.price
                                                }))
                                            }
                                        }else{
                                            setNewTimeSheetInvoice(prevState => ({
                                                ...prevState,
                                                "cl_folder": ""
                                            }))
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant={"outlined"}
                                            value={newTimeSheetInvoice.cl_folder || ""}
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
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-lg-12 mb-1">
                                <Typography variant="subtitle1"
                                            style={{fontSize: 14, color: "#616161"}}>
                                    Description&nbsp;
                                    <b>{newTimeSheetInvoice.client !== "" ? (newTimeSheetInvoice.client.lang === "fr" ? "(Français)" : "(Anglais)") : ""}</b>
                                </Typography>
                                <TextField
                                    type={"text"}
                                    multiline={true}
                                    rows={4}
                                    variant="outlined"
                                    value={newTimeSheetInvoice.desc}
                                    onChange={(e) => {
                                        setNewTimeSheetInvoice(prevState => ({
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
                                    value={newTimeSheetInvoice.user || ""}
                                    onChange={(event, value) => {
                                        if (value) {
                                            setNewTimeSheetInvoice(prevState => ({
                                                ...prevState,
                                                "user": value,
                                                "user_price": value.price || ""
                                            }))
                                        } else {
                                            setNewTimeSheetInvoice(prevState => ({
                                                ...prevState,
                                                "user": "",
                                                "user_price": ""
                                            }))
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <div style={{display:"flex"}}>
                                            <div style={{alignSelf:"center",position:"absolute"}}>
                                                <img alt="" src={newTimeSheetInvoice.user.image || userAvatar} style={{objectFit:"contain",width:30,height:30,marginLeft:3}}/>
                                            </div>
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                value={newTimeSheetInvoice.user || ""}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    style:{
                                                        alignSelf:"center",
                                                        marginLeft:22
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
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="col-lg-6 mb-1">
                                <Typography variant="subtitle1"
                                            style={{fontSize: 14, color: "#616161"}}>Taux horaire</Typography>
                                <TextField
                                    style={{width: "100%"}}
                                    type={"text"}
                                    variant="outlined"
                                    inputMode="tel"
                                    value={newTimeSheetInvoice.user_price}
                                    onChange={(e) => {
                                        setNewTimeSheetInvoice(prevState => ({
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
                    </div>
                </DialogContent>
                <DialogActions style={{paddingRight:30,paddingBottom:15}}>
                    <MuiButton
                        onClick={() => {
                            setOpenNewTsInvoiceModal(false)
                        }}
                        color="primary"
                        variant="outlined"
                        style={{textTransform: 'capitalize', fontWeight: 700}}
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton
                        disabled={newTimeSheetInvoice.date === "" || !utilFunctions.verif_duration(newTimeSheetInvoice.duration) || !newTimeSheetInvoice.client.id ||
                            !newTimeSheetInvoice.cl_folder.id || !newTimeSheetInvoice.user.id ||
                            isNaN(parseFloat(newTimeSheetInvoice.user_price)) || parseFloat(newTimeSheetInvoice.user_price) < 0}
                        onClick={() => {
                            setOpenNewTsInvoiceModal(false)
                            add_new_ts_modal()
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
                                Vous êtes sur le point de supprimer cette&nbsp;{toUpdateFact.type === "invoice" ? "facture" : "provision"}
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

            <Modal backdrop={true} role="alertdialog" open={openValidateFactModal}
                   onClose={() => {setOpenValidateFactModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    {
                        toUpdateFact &&
                        <Typography variant="h6" color="primary" style={{fontWeight: 700, fontSize: 16}}>
                            Valider&nbsp;{toUpdateFact.type === "invoice" ? "facture" : "provision"}
                        </Typography>
                    }
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateFact &&
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de valider cette&nbsp;{toUpdateFact.type === "invoice" ? "facture" : "provision"}
                            </Typography>
                        </div>
                    </Modal.Body>
                }

                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700}}
                               onClick={() => {
                                   setOpenValidateFactModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                               onClick={() => {
                                   setOpenValidateFactModal(false)
                                   validate_provision(toUpdateFact.id,1)
                               }}
                    >
                        Valider
                    </MuiButton>

                </Modal.Footer>
            </Modal>

            <Modal backdrop={true} role="alertdialog" open={openPaymFactModal}
                   onClose={() => {setOpenPaymFactModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    {
                        toUpdateFact &&
                        <Typography variant="h6" color="primary" style={{fontWeight: 700, fontSize: 16}}>
                            Marquer la&nbsp;{toUpdateFact.bill_type === "invoice" ? "facture" : "provision"}&nbsp;comme payée
                        </Typography>
                    }
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                {
                    toUpdateFact &&
                    <Modal.Body>
                        <div>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de marquer cette&nbsp;{toUpdateFact.bill_type === "invoice" ? "facture" : "provision"}&nbsp;comme payée
                            </Typography>
                            <Typography variant="h6" style={{fontSize:14}}>
                                <b>Attention, Vous n'aurez plus le droit de modifier ou supprimer cette&nbsp;{toUpdateFact.bill_type === "invoice" ? "facture" : "provision"}</b>
                            </Typography>
                        </div>
                    </Modal.Body>
                }

                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700}}
                               onClick={() => {
                                   setOpenPaymFactModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                               onClick={() => {
                                   setOpenPaymFactModal(false)
                                   pay_invoice(toUpdateFact.bill_type === "invoice" ? "facture" : "provision",toUpdateFact.id,2)
                               }}
                    >
                        Valider
                    </MuiButton>

                </Modal.Footer>
            </Modal>

            <Modal backdrop={true} role="alertdialog" open={openRemoveTsInvoiceModal}
                   onClose={() => {setOpenRemoveTsInvoiceModal(false)}} size="sm"
                   keyboard={true}
            >
                <Modal.Header>
                    <Typography variant="h6" color="primary" style={{fontWeight: 700, fontSize: 16}}>
                        Retirer timesheet du facture
                    </Typography>
                    <hr style={{marginBottom:2,marginTop:15}}/>
                </Modal.Header>
                    <Modal.Body>
                        <div style={{display:"flex"}}>
                            <Typography variant="h6" style={{fontSize:14}}>
                                Vous êtes sur le point de retirer ce timesheet de la facture
                            </Typography>
                        </div>
                    </Modal.Body>
                <Modal.Footer>
                    <MuiButton color="primary" size="medium"
                               style={{textTransform:"none",fontWeight:700}}
                               onClick={() => {
                                   setOpenRemoveTsInvoiceModal(false)
                               }}
                               variant="outlined"
                    >
                        Annuler
                    </MuiButton>
                    <MuiButton variant="contained" color="danger" size="medium"
                               style={{textTransform:"none",fontWeight:700,marginLeft:"1rem"}}
                               onClick={() => {
                                   setOpenRemoveTsInvoiceModal(false)
                                   remove_ts_from_invoice(toUpdateTsInvoice)
                               }}
                    >
                        Retirer
                    </MuiButton>

                </Modal.Footer>
            </Modal>

        </div>
    )}