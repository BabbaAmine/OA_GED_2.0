import {api_endpoint} from "../constants/defaultValues";
const endpoint = api_endpoint

let extern_sso_service = {

    loadHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Accept", '*/*');
        return headers;
    },

    sso() {
        return fetch(endpoint + '/sso', {
            method: 'GET',
            headers: this.loadHeaders(),
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });


    },


    conn(id) {
        return fetch(endpoint + '/sso/conn/' + id, {
            method: 'GET',
            headers: this.loadHeaders(),
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });
    }
}


export default extern_sso_service;
