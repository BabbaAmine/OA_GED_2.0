import React,{useEffect} from "react";
import Project_functions from "../../tools/project_functions";
import projectFunctions from "../../tools/project_functions";
import PQueue from "p-queue";
import moment from "moment";
import ApiBackService from "../../provider/ApiBackService";
import TransferDataService from "../../provider/TransferDataService";
import SmartdomService from "../../provider/SmartdomService";
import RethinkService from "../../provider/RethinkService";
import {toast} from "react-toastify";
import MuiBackdrop from "../../components/Loading/MuiBackdrop";
import {
    Button as MuiButton
} from "@mui/material";


export default function ImportDataFromV1(props) {

    const [loading, setLoading] = React.useState(false);
    const [clients, setClients] = React.useState();
    const [folders, setFolders] = React.useState();
    const [banks, setBanks] = React.useState();
    const [oa_users, setOa_users] = React.useState();

    useEffect(() => {
        !clients && get_clients()
        !folders && get_clients_folders()
        !oa_users && get_oa_users()
        !banks && get_banks()
    }, [])

    const get_clients = async () => {
        let clients = await Project_functions.get_clients({}, "", 1, 10000)
        if (clients && clients !== "false") {
            console.log("GET LIST CLINETS OK")
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

    const get_clients_folders = async () => {
        let folders = await Project_functions.get_folders({}, "", 1, 100000)
        if (folders && folders !== "false") {
            console.log("GET FOLDERS OK")
            setFolders(folders)
        }
    }

    const get_oa_users = async () => {
        let oa_users = await Project_functions.get_oa_users({}, "", 1, 200)
        if (oa_users && oa_users !== "false") {
            console.log("GET LIST USERS OK")
            setOa_users(oa_users)
        } else {
            console.error("ERROR GET LIST USERS")
        }
    }

    const get_banks = async () => {
        let banks = await Project_functions.get_banks({}, "", 1, 50)
        if (banks && banks !== "false") {
            console.log("GET LIST BANKS OK")
            setBanks(banks)
        } else {
            console.error("ERROR GET LIST BANKS")
            setTimeout(() => {
                get_banks()
            }, 10000)
        }
    }

    const get_timesheets_from_v1 = async () => {
        setLoading(true)
        let v1_invoices = await get_bills_from_v1()
        console.log(v1_invoices.length + " factures from v1")
        let factures_ts = []
        v1_invoices.map( fact => {
            (fact.lignes_facture || []).map((lf,k) => {
                (fact.statut === "accepted" || fact.statut === "paid") && lf.id && factures_ts.push(lf.id)
            })
        })
        projectFunctions.getRethinkTableData("OA_LEGAL", "test", "time_sheets").then( res => {
            let filtred_data = res || []
            let queue = new PQueue({concurrency: 5});
            let calls = [];
            filtred_data.map((item, key) => {

                if ('newTime' in item && 'client_id' in item.newTime && 'dossier_client' in item.newTime &&
                    'folder_id' in item.newTime.dossier_client && 'utilisateurOA' in item.newTime) {
                    let client_id = projectFunctions.get_client_id_by_v1_id(clients, item.newTime.client_id)
                    let folder_id = projectFunctions.get_client_folder_id_by_v1_id(folders, item.newTime.dossier_client.folder_id)
                    let data = {
                        date: 'created_at' in item ? moment(item.created_at).unix() : null,
                        client: client_id,
                        client_folder: folder_id,
                        user: projectFunctions.get_user_id_by_email(oa_users, item.newTime.utilisateurOA),
                        desc: ('newTime' in item && 'description' in item.newTime) ? item.newTime.description : "",
                        duration: ('newTime' in item && 'duree' in item.newTime) ? item.newTime.duree : 0,
                        price: ('newTime' in item && 'rateFacturation' in item.newTime) ? parseInt(item.newTime.rateFacturation) : 0,
                        extra: {
                            v1_ts_id: item.id || false,
                            v1_ts_uid: item.uid || false,
                        }
                    }
                    if (data.client !== "false" && data.client_folder !== "false" && data.duration !== "") {
                        calls.push(
                            () => ApiBackService.add_ts(client_id, folder_id.split("/").pop(), data).then(r => {
                                console.log("TS " + data.desc + " ADDED")
                                return ("TS " + data.desc + " ADDED")
                            })
                        )
                    }
                }
            })
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }

    const get_bills_from_v1 = () => {

        return new Promise( resolve => {

            projectFunctions.getRethinkTableData("OA_LEGAL", "test", "factures").then( res => {
                let filtred_data = res.filter(x => (!'removed_from_odoo' in x || x.removed_from_odoo !== "true") && (!'type' in x || x.type !== "provision") && ('lignes_facture' in x && x.lignes_facture.length > 0))
                resolve(filtred_data)
            }).catch( err => {
                resolve("false")
            })

        })
    }

    const get_timesheets_from_v1_by_email = (user_email) => {
        setLoading(true)
        projectFunctions.getTableDataByLabel("OA_LEGAL", "test", "time_sheets","{'newTime':{'utilisateurOA':'"+user_email+"'}}").then( res => {
            let filtred_data = res || []
            let queue = new PQueue({concurrency: 5});
            let calls = [];
            filtred_data.map((item, key) => {

                if ('newTime' in item && 'client_id' in item.newTime && 'dossier_client' in item.newTime &&
                    'folder_id' in item.newTime.dossier_client && 'utilisateurOA' in item.newTime) {
                    let client_id = projectFunctions.get_client_id_by_v1_id(clients, item.newTime.client_id)
                    let folder_id = projectFunctions.get_client_folder_id_by_v1_id(folders, item.newTime.dossier_client.folder_id)
                    let data = {
                        date: 'created_at' in item ? moment(item.created_at).unix() : null,
                        client: client_id,
                        client_folder: folder_id,
                        user: projectFunctions.get_user_id_by_email(oa_users, item.newTime.utilisateurOA),
                        desc: ('newTime' in item && 'description' in item.newTime) ? item.newTime.description : "",
                        duration: ('newTime' in item && 'duree' in item.newTime) ? item.newTime.duree : 0,
                        price: ('newTime' in item && 'rateFacturation' in item.newTime) ? parseInt(item.newTime.rateFacturation) : 0,
                        extra: {
                            v1_ts_id: item.id || false,
                            v1_ts_uid: item.uid || false,
                        }
                    }
                    if (data.client !== "false" && data.client_folder !== "false" && data.duration !== "") {
                        calls.push(
                            () => ApiBackService.add_ts(client_id, folder_id.split("/").pop(), data).then(r => {
                                console.log("TS " + data.desc + " ADDED")
                                return ("TS " + data.desc + " ADDED")
                            })
                        )
                    }
                }
            })
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }

    const get_factures_from_v1 = (user_email) => {

        setLoading(true)
        projectFunctions.getTableDataByLabel("OA_LEGAL", "test", "factures","{'partner':'"+user_email+"'}").then(res => {
            let filtred_data = res.filter(x => (!'removed_from_odoo' in x || x.removed_from_odoo !== "true") && (!'type' in x || x.type !== "provision") && ('lignes_facture' in x && x.lignes_facture.length > 0))
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            filtred_data.map((item, key) => {

                if ('client_id' in item && 'client_folder' in item && 'id' in item.client_folder) {

                    let client_id = projectFunctions.get_client_id_by_v1_id(clients, item.client_id)
                    let folder_id = projectFunctions.get_client_folder_id_by_v1_id(folders, item.client_folder.id)

                    let address = []
                    let find_client = clients.find(x => x.id === client_id)
                    if (find_client) {
                        address.push(projectFunctions.get_client_title(find_client))
                        address.push(find_client.adresse.street)
                        address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
                    } else {
                        address.push("")
                        address.push("")
                        address.push("")
                        address.push("")
                    }

                    let data = {
                        date: moment(item.date_facture).unix(),
                        bill_type: "invoice",

                        TVA: 7.7,
                        before_payment: 30,
                        bank: projectFunctions.get_bank_by_iban(banks, "CH95 8080 8001 1709 3913 2"),
                        timesheet: item.lignes_facture,

                        TVA_inc: false,
                        lang: (find_client && 'lang' in find_client) ? find_client.lang : "fr",
                        client: client_id,
                        client_folder: folder_id,
                        user: projectFunctions.get_user_id_by_email(oa_users, item.partner),
                        address: address,
                        format: ["date", "desc"],
                        extra: {
                            statut: item.statut || false,
                            processed: item.processed || false,
                            paid: item.paid || false,
                            facture_odoo_id: item.facture_odoo_id || false,
                            v1_bill_id: item.id,
                            v1_bill_ID: item.ID || false
                        }
                    }
                    if('odoo_id' in item && item.odoo_id === "9035ce2a-a7a2-11eb-bcbc-0242ac130002"){
                        data.extra.is_DK = true
                        data.extra.DK_ODOO_ID = item.odoo_id
                    }

                    calls.push(
                        () => create_invoice_from_v1(client_id, folder_id.split("/").pop(), data).then(r => {
                            return ("INVOICE FROM V1 ADDED WITH ID: " + data.extra.v1_bill_id)
                        })
                    )
                }
            })
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }

    const delete_all_factures = async () => {
        setLoading(true)
        let invoices = await projectFunctions.get_bills({bill_type: "invoice"}, "", 1, 5000)
        console.log(invoices)
        let queue = new PQueue({concurrency: 1});
        let calls = [];
        invoices !== "false" && invoices.map( inv => {
            let client_id = inv.id.split("/").shift()
            let folder_id = inv.id.split("/")[1]
            let bill_id = inv.id.split("/").pop()
            calls.push(
                () => ApiBackService.delete_invoice(client_id, folder_id, bill_id).then(DeleteRes => {
                    console.log(DeleteRes.status)
                    return ("DELETE INVOICE " + bill_id + " DONE")
                })
            )
        })

        queue.addAll(calls).then(final => {
            console.log(final)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    const create_invoice_from_v1 = (client_id, folder_id, data) => {

        return new Promise(async resolve => {

            let newData = await get_v1_details_from_odoo(data)
            newData.timesheet = await get_v2_timesheets(data.timesheet)

            ApiBackService.create_invoice(client_id, folder_id, newData).then(r => {
                if (r.status === 200 && r.succes === true) {
                    console.log("INVOICE FOR USER" + data.user + " ADDED")
                    resolve("INVOICE FOR USER" + data.user + " ADDED")
                } else {
                    console.log(r.error)
                    resolve("false")
                }
            }).catch(err => {
                console.log(err)
                console.log("ERROR CREATE INVOICE FROM V1: " + data.extra.v1_bill_id)
                resolve("false")
            })
        })
    }

    const get_v1_details_from_odoo = (data) => {

        return new Promise(resolve => {

            if (data.extra.facture_odoo_id !== false && data.extra.facture_odoo_id !== "") {
                let odoo_id = 'DK_ODOO_ID' in data.extra ? data.extra.DK_ODOO_ID : "796dc0ed-8b4a-40fd-aeff-7ce26ee1bcf9"
                SmartdomService.details_facture_odoo(odoo_id, data.extra.facture_odoo_id).then(invRes => {
                    if (invRes.status === 200 && invRes.succes === true && 'data' in invRes && invRes.data.length > 0) {
                        let inv_detail = invRes.data[0]
                        if ('partner_bank_id' in inv_detail && inv_detail.amount_by_group.length > 1) {
                            data.bank = projectFunctions.get_bank_by_iban(banks, inv_detail.partner_bank_id[1])
                        }
                        if ('amount_by_group' in inv_detail && inv_detail.amount_by_group.length > 0) {
                            if (typeof inv_detail.amount_by_group[0] === "string" && inv_detail.amount_by_group[0].includes("7.7")) {
                                data.TVA = 7.7
                            } else {
                                data.TVA = 0
                            }
                        }
                        if ('payment_term_id' in inv_detail && inv_detail.payment_term_id.length > 1) {
                            data.before_payment = inv_detail.payment_term_id[0] === 1 ? 0 :
                                inv_detail.payment_term_id[0] === 2 ? 15 :
                                    inv_detail.payment_term_id[0] === 3 ? 30 :
                                        inv_detail.payment_term_id[0] === 4 ? 45 :
                                            inv_detail.payment_term_id[0] === 5 ? 60 : 0
                        }
                    }
                    resolve(data)
                }).catch(err => {
                    console.log("ERROR GET DETAILS ODOO INVOICE")
                    console.log(err)
                    resolve(data)
                })
            } else {
                resolve(data)
            }
        })
    }

    const get_v2_timesheets = (v1_timesheets) => {

        return new Promise(resolve => {

            let queue = new PQueue({concurrency: 1});
            let calls = [];
            let ts = []
            v1_timesheets.map(item => {
                let data = {
                    db: "ged",
                    table: "timesheet",
                    filter: {
                        extra: {
                            v1_ts_id: item.id
                        }
                    }
                }
                calls.push(
                    () => RethinkService.get_detail_ts(data).then(res => {
                        console.log(res)
                        if (res.status === 200 && res.succes === true && 'data' in res && res.data.length > 0) {
                            ts.push(res.data[0].id.split("/").pop())
                        } else {
                            console.log("ERROR GET TS FROM V2: " + item.id)
                        }
                    }).catch( err => {
                        console.log("ERROR GET DETAILS TS")
                    })
                )
            })
            queue.addAll(calls).then(final => {
                console.log(ts)
                resolve(ts)
            }).catch(err => {
                console.log(err)
                resolve(ts)
            })

        })
    }

    const get_provisions_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL", "test", "factures").then(res => {
            let filtred_data = res.filter(x =>  (!'removed_from_odoo' in x || x.removed_from_odoo !== "true") && ('type' in x && x.type === "provision"))
            let queue = new PQueue({concurrency: 5});
            let calls = [];
            filtred_data.map((item, key) => {

                if ('client_id' in item && 'client_folder' in item && 'id' in item.client_folder && 'details_provision' in item) {

                    let client_id = projectFunctions.get_client_id_by_v1_id(clients, item.client_id)
                    let folder_id = projectFunctions.get_client_folder_id_by_v1_id(folders, item.client_folder.id)

                    let address = []
                    let find_client = clients.find(x => x.id === client_id)
                    if (find_client) {
                        address.push(projectFunctions.get_client_title(find_client))
                        address.push(find_client.adresse.street)
                        address.push(find_client.adresse.postalCode + " " + find_client.adresse.city)
                    } else {
                        address.push("")
                        address.push("")
                        address.push("")
                        address.push("")
                    }

                    let data = {
                        date: moment(item.date_facture).unix(),
                        bill_type: "provision",
                        TVA: item.details_provision.tax === 13 ? 7.7 : 0,
                        TVA_inc: false,
                        lang: (find_client && 'lang' in find_client) ? find_client.lang : "fr",
                        client: client_id,
                        client_folder: folder_id,
                        prov_amount: parseFloat(item.details_provision.amount),
                        user: projectFunctions.get_user_id_by_email(oa_users, item.created_by),
                        bank: projectFunctions.get_bank_by_iban(banks, item.details_provision.bank.code),
                        address: address,
                        before_payment: 0,
                        qr: false,
                        extra: {
                            statut: item.statut || false,
                            processed: item.processed || false,
                            paid: item.paid || false,
                            facture_odoo_id: item.facture_odoo_id || false,
                            v1_bill_id: item.id,
                            v1_bill_ID: item.ID || false,
                            used_in_invoice:item.used || 0
                        }
                    }
                    if('odoo_id' in item && item.odoo_id === "9035ce2a-a7a2-11eb-bcbc-0242ac130002"){
                        data.extra.is_DK = true
                        data.extra.DK_ODOO_ID = item.odoo_id
                    }
                    if (data.client !== "false" && data.client_folder !== "false" && data.bank !== "false") {
                        calls.push(
                            () => ApiBackService.create_invoice(client_id, folder_id.split("/").pop(), data).then(r => {
                                console.log("PROVISION FOR USER" + data.user + " ADDED")
                                return ("PROVISION FOR USER" + data.user + " ADDED")
                            })
                        )
                    }
                }
            })
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }

    const validate_list_provisions = async () => {
        setLoading(true)
        let provisions = await projectFunctions.get_bills({bill_type: "provision"}, "", 1, 5000)
        console.log(provisions)
        let queue = new PQueue({concurrency: 1});
        let calls = [];
        provisions.map(prov => {
            let client_id = prov.id.split("/").shift()
            let folder_id = prov.id.split("/")[1]
            let bill_id = prov.id.split("/").pop()
            calls.push(
                () => ApiBackService.validate_invoice(client_id, folder_id, bill_id, {status: 1}).then(validateRes => {
                    console.log(validateRes.status)
                    return ("VALIDATE PROVISION OK")
                })
            )
        })

        queue.addAll(calls).then(final => {
            console.log(final)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })

    }

    const pay_list_provisions = async () => {
        setLoading(true)
        let provisions = await projectFunctions.get_bills({bill_type: "provision"}, "", 1, 5000)
        console.log(provisions)
        let queue = new PQueue({concurrency: 1});
        let calls = [];
        provisions.map(prov => {
            let client_id = prov.id.split("/").shift()
            let folder_id = prov.id.split("/")[1]
            let bill_id = prov.id.split("/").pop()
            calls.push(
                () => ApiBackService.get_invoice(client_id, folder_id, bill_id).then(invRes => {
                    if (invRes.data.extra.statut === "paid") {
                        ApiBackService.validate_invoice(client_id, folder_id, bill_id, {status: 2}).then(validateRes => {
                            console.log(validateRes.status)
                            console.log("VALIDATE BILL " + invRes.data.id)
                            return ("PAY BILL OK")
                        })
                    }
                })
            )
        })

        queue.addAll(calls).then(final => {
            console.log(final)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })

    }

    const get_client_folders_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL", "test", "clients_cases").then(res => {
            let filtred_data = res
            console.log(filtred_data)
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            filtred_data.map(item => {
                console.log("ENTER FIRST LOOP");
                (item.folders || []).map(folder => {
                    let data = {
                        autrepartie: folder.autrepartie || "",
                        conterpart: folder.contrepartie || "",
                        name: folder.name || "",
                        user_in_charge: "",
                        user_in_charge_price: "",
                        extra: {
                            v1_folder_id: folder.folder_id || false
                        },
                        associate: []
                    };
                    if('admin_odoo_id' in item && item.admin_odoo_id === "9035ce2a-a7a2-11eb-bcbc-0242ac130002"){
                        data.extra.is_DK = true
                    }
                    (folder.team || []).map(user => {
                        if (user.email && user.email !== "" && projectFunctions.get_user_id_by_email(oa_users, user.email) !== "false") {
                            data.associate.push({
                                id: projectFunctions.get_user_id_by_email(oa_users, user.email),
                                price: (user.tarif && user.tarif !== "" && parseFloat(user.tarif) > 0) ? parseFloat(user.tarif) : ""
                            })
                        }
                    });
                    if (item.ID_client && item.ID_client !== "") {
                        let find_client = (clients || []).find(x => x.extra.ID === item.ID_client || x.extra.id === item.ID_client)
                        if (find_client) {
                            calls.push(
                                () => ApiBackService.create_client_folder(find_client.id, data).then(r => {
                                    if (r.status === 200 && r.succes === true) {
                                        console.log("FOLDER" + data.name + " ADDED")
                                    } else {
                                        console.log("ERROR ADD: " + data.name)
                                    }
                                    return ("FOLDER " + data.name + " ADDED")
                                })
                            )
                        }
                    }

                });
            });
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }

    const get_client_from_v1 = () => {
        setLoading(true)
        projectFunctions.getRethinkTableData("OA_LEGAL", "test", "annuaire_clients_mandat").then(res => {
            let filtred_data = res
            let queue = new PQueue({concurrency: 1});
            let calls = [];
            filtred_data.map((item, key) => {
                let data = {
                    type: item.Type ? parseInt(item.Type) : 0,
                    name_1: item.Prenom || "",
                    name_2: item.Nom || "",
                    email: item.email || "",
                    phone: item.phone || "",
                    adresse: {
                        street: item.adress_fact_street || "",
                        postalCode: item.adress_fact_pc || "",
                        city: item.adress_fact_city || "",
                        pays: item.adress_fact_country ? (item.adress_fact_country === "43" ? "Switzerland" : "") : "",
                    },
                    lang: item.lang_fact ? (item.lang_fact === "en_US" ? "en" : "fr") : "fr",
                    extra: {
                        id: item.id || false,
                        ID: item.ID || false
                    }
                }
                if('admin_odoo_id' in item && item.admin_odoo_id === "9035ce2a-a7a2-11eb-bcbc-0242ac130002"){
                    data.extra.is_DK = true
                }
                calls.push(
                    () => ApiBackService.add_client(data).then(r => {
                        console.log("CLIENT " + data.name_1 + " ADDED")
                        return ("CLIENT " + data.name_1 + " ADDED")
                    })
                )
            })
            queue.addAll(calls).then(final => {
                console.log(final)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })


        }).catch(err => console.log(err))
    }


    return (

        <div align="center" style={{marginTop: 50}}>

            <MuiBackdrop open={loading} text={"Chargement..."}/>

            <div className="row">
                <div className="col-lg-6 mb-1">
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       get_client_from_v1()
                                   }}
                        >
                            Import clients from V1
                        </MuiButton>
                    </div>
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       get_client_folders_from_v1()
                                   }}
                        >
                            Import folders from V1
                        </MuiButton>
                    </div>
                    <hr/>
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       get_provisions_from_v1()
                                   }}
                        >
                            Import provisions from V1
                        </MuiButton>
                    </div>
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       validate_list_provisions()
                                   }}
                        >
                            Validate list provisions
                        </MuiButton>
                    </div>
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       pay_list_provisions()
                                   }}
                        >
                            Pay list provisions
                        </MuiButton>
                    </div>
                    <div className="p-2">
                        <MuiButton variant="contained" color="primary" size="medium"
                                   style={{textTransform: "none", fontWeight: 800}}
                                   onClick={() => {
                                       get_timesheets_from_v1()
                                   }}
                        >
                            get all timehseets
                        </MuiButton>
                    </div>
                </div>

                <div className="col-lg-6">
                    {
                        (oa_users || []).map((item,key) => (
                            <div key={key} className="p-2">
                                <MuiButton variant="contained" color="primary" size="medium"
                                           style={{textTransform: "none", fontWeight: 800}}
                                           onClick={() => {
                                               get_factures_from_v1(item.email)
                                           }}
                                >
                                    get list factures of {item.email}
                                </MuiButton>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )

}