const endpoint = "http://146.59.155.94:8080"


let  ApiBackService = {

    loadHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Accept", '*/*');
        headers.append("usrtoken", localStorage.getItem("usrtoken"));

        return headers;
    },

    //Equipe OA

    get_users(data,page,number){
        return fetch(endpoint + "/users?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_user_details(id){
        return fetch(endpoint + "/user/" + id, {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    update_user(id,data){
        return fetch(endpoint + "/user/" + id, {
            method: 'PUT',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    delete_user(id){
        return fetch(endpoint + "/user/" + id, {
            method: 'DELETE',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    //Clients

    add_client(data){
        return fetch(endpoint + "/client", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_clients(data,page,number){
        return fetch(endpoint + "/clients?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_client_details(id){
        return fetch(endpoint + "/client/" + id, {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    update_client(id,data){
        return fetch(endpoint + "/client/" + id, {
            method: 'PUT',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    delete_client(id){
        return fetch(endpoint + "/client/" + id, {
            method: 'DELETE',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    // clinets folders (mondat)

    get_all_folders(data,page,number){
        return fetch(endpoint + "/folders?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_client_folders(client_id,data,page,number){
        return fetch(endpoint + "/client/"+client_id+"/folders?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    create_client_folder(client_id,data){
        return fetch(endpoint + "/client/"+client_id+"/folder", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_client_folder_details(client_id,folder_id){
        return fetch(endpoint + "/client/" + client_id + "/folder/" + folder_id, {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    update_client_folder(client_id,folder_id,data){
        return fetch(endpoint + "/client/" + client_id + "/folder/" + folder_id, {
            method: 'PUT',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    delete_client_folder(client_id,folder_id){
        return fetch(endpoint + "/client/" + client_id + "/folder/" + folder_id, {
            method: 'DELETE',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    //TimeSheets

    get_timesheets(data,page,number){
        return fetch(endpoint + "/timesheets?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_timesheets_by_folder(data,page,number){
        return fetch(endpoint + "/v2/timsheet/byfolders?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_sum_timesheets(data){
        return fetch(endpoint + "/timesheets/sum", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },
    get_sum_bills(data){
        return fetch(endpoint + "/bills/sum", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_timesheet(client_id,folder_id,ts_id){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/timesheet/" + ts_id, {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    add_ts(client_id,folder_id,data){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/timesheet", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    update_ts(data,client_id,folder_id,ts_id){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/timesheet/" + ts_id, {
            method: 'PUT',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    delete_ts(client_id,folder_id,ts_id){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/timesheet/" + ts_id, {
            method: 'DELETE',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    //Invoice

    create_invoice(client_id,folder_id,data){
        return fetch(endpoint + "/client/" + client_id + "/folder/" + folder_id + "/bill", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_invoices(data,page,number){
        return fetch(endpoint + "/bills?page=" + page +"&number=" + number, {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    get_invoice(client_id,folder_id,bill_id){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/bill/" + bill_id, {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    delete_invoice(client_id,folder_id,bill_id){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/bill/" + bill_id, {
            method: 'DELETE',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    update_invoice(client_id,folder_id,bill_id,data){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/bill/" + bill_id, {
            method: 'PUT',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },

    validate_invoice(client_id,folder_id,bill_id,data){
        return fetch(endpoint + "/client/"+client_id+"/folder/" + folder_id + "/bill/" + bill_id + "/status", {
            method: 'POST',
            headers:this.loadHeaders(),
            body:JSON.stringify(data)
        }).then(response => response.json()).catch( err => {
            console.log(err);
        });
    },


}


export default ApiBackService;
