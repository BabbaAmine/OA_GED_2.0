import moment from "moment";
import ApiBackService from "../provider/ApiBackService";
import {toast} from "react-toastify";


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

    get_clients(filter,exclude,page,number){
        return new Promise( resolve => {
            ApiBackService.get_clients({filter:filter,exclude: exclude},page,number).then( res => {
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

    get_client_adress(client){
        let adress = client.adresse
        if(adress.street.trim() !== "" && adress.postalCode.trim() !== ""){
            return adress.street + ", " + adress.postalCode + " " + adress.city + " " + (adress.pays || "")
        }else{
            return ""
        }
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
    }


}

export default projectFunctions




