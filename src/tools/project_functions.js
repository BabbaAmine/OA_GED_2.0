import moment from "moment";
import ApiBackService from "../provider/ApiBackService";
import {toast} from "react-toastify";
import PQueue from "p-queue";


let projectFunctions = {

    verifSession(usrtoken,exp) {
        return !(usrtoken === null || usrtoken === undefined || exp < moment().unix())
    },

    get_oa_users(filter,exclude,page,number){

        return new Promise( resolve => {
            ApiBackService.get_users({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list.sort((a, b) => {
                        let c = a.index || -1
                        var d = b.index || -1
                        return c - d;
                    }))
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })

    },

    find_oa_user(filter,exclude,page,number){

        return new Promise( resolve => {
            ApiBackService.get_users({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list.length > 0 ?res.data.list[0]: "false")
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })

    },

    get_clients(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_clients({filter:filter,exclude: exclude},page,number).then( res => {
                console.log(res)
                if(res.status === 200 && res.succes === true){
                    let user_email = localStorage.getItem("email")
                    console.log(user_email)
                    let clients = res.data.list;
                    let filter_clients = [];
                    if(user_email === "dkohler@oalegal.ch"){
                        filter_clients = clients.filter( x => ('extra' in x && 'is_DK' in x.extra && x.extra.is_DK === true) || !('extra' in x))
                    }else{
                        filter_clients = clients.filter( x => ('extra' in x && !('is_DK' in x.extra)) || !('extra' in x))
                    }
                    resolve(filter_clients)
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })
    },

    get_folders(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_all_folders({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list)
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })
    },

    get_banks(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_banks({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list.sort((a, b) => {
                        var c = new Date(a.created_at);
                        var d = new Date(b.created_at);
                        return c - d;
                    }))
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })
    },

    get_bills(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_invoices({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list)
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })
    },

    get_clients_table_test(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_clients({filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data)
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })
    },

    get_client_folders(client_id,filter,exclude,page,number){

        return new Promise( resolve => {
            ApiBackService.get_client_folders(client_id,{filter:filter,exclude: exclude},page,number).then( res => {
                if(res.status === 200 && res.succes === true){
                    resolve(res.data.list)
                }else{
                    console.log(res.error)
                    resolve("false")
                }
            }).catch( err => {
                console.log(err)
                resolve("false")
            })
        })

    },

    get_client_title(client){
        let cl = ""
        if(client.type === 0){
            cl = client.name_2
        }else{
            cl = client.name_2 + ((client.name_1 && client.name_1.trim() !== "") ? (" " + client.name_1) : "")
        }
        return cl
    },

    get_user_id_by_email(users,email){
        let user = (users || []).find(x => x.email === email)
        return user !== undefined ? user.id : email
    },

    get_client_id_by_v1_id(clients,v1_id){
        let client = (clients || []).find(x => 'extra' in x && (x.extra.id === v1_id || x.extra.ID === v1_id ))
        return client !== undefined ? client.id : "false"
    },

    get_client_folder_id_by_v1_id(folders,v1_id){
        let folder = (folders || []).find(x => 'extra' in x && x.extra.v1_folder_id === v1_id)
        return folder !== undefined ? folder.id : "false"
    },

    get_bank_by_iban(banks,num_compte){
        let bank = (banks || []).find(x => x.iban.trim() === num_compte.trim())
        return bank !== undefined ? bank.id: "false"
    },

    get_client_adress(client){
        let adress = client.adresse
        if(adress.street.trim() !== "" && adress.postalCode.trim() !== ""){
            return adress.street + ", " + adress.postalCode + " " + adress.city + " " + (adress.pays || "")
        }else{
            return ""
        }
    },

    get_timesheet_array_detail(client_id,folder_id,list){
        return new Promise( resolve => {
            let queue = new PQueue({concurrency: 1});
            let timesheets = [];
            let calls = [];
            list.map( item => {
                calls.push(
                    () => ApiBackService.get_timesheet(client_id,folder_id,item.id ? item.id.split("/").pop() : item.timesheet_id.split("/").pop()).then( r => {
                        console.log(r)
                        timesheets.push(r.data)
                        return ("TS " + (item.id ? item.id.split("/").pop() : item.timesheet_id.split("/").pop() ) + " GET OK")
                    })
                )
            })
            queue.addAll(calls).then( final => {
                resolve(timesheets)
            }).catch( err => {
                console.log(err)
                resolve(timesheets.length > 0 ? timesheets : list)
            })

        })
    },

    //IMPORT
    getRethinkTableData(db_name,usr_token,table){
        return new Promise(function(resolve, reject) {
            let socket = new WebSocket("wss://api.smartdom.ch/ws/" + usr_token);

            socket.onopen = function(e) {
                let payload;
                payload = {"cmd": "db('"+db_name+"').table('"+table+"').filter('true')"}
                socket.send(JSON.stringify(payload));
            };
            let data = [];
            socket.onmessage = function(event) {
                let recieve = JSON.parse(event.data);
                if(recieve && recieve.id){
                    data.push(recieve)
                }
            }
            socket.error = function(event) {
                console.log("ERROR GET TABLE LIST RETHINK");
                reject(event)
            };

            socket.onclose = (event) => {
                console.log("CLOSED");
                resolve(data)
            };

        });
    },

    getTableDataByLabel(db_name,usr_token,table,filter){
        return new Promise(function(resolve, reject) {
            let socket = new WebSocket("wss://api.smartdom.ch/ws/" + usr_token);

            socket.onopen = function(e) {
                let payload;
                payload = {"cmd": "db('"+db_name+"').table('"+table+"').filter("+filter+")"}
                socket.send(JSON.stringify(payload));
            };
            let data = [];
            socket.onmessage = function(event) {
                let recieve = JSON.parse(event.data);
                if(recieve && recieve.id){
                    data.push(recieve)
                }
            }
            socket.error = function(event) {
                console.log("ERROR GET TABLE LIST RETHINK");
                reject(event)
            };

            socket.onclose = (event) => {
                console.log("CLOSED");
                resolve(data)
            };

        });
    }


}

export default projectFunctions




