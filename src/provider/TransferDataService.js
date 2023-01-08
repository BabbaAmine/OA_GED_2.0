const endpoint = "http://localhost:8080";

let transfertDataService = {

    loadHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Accept", '*/*');
        return headers;
    },

    insert_data(data) {
        console.log(data)
        return fetch(endpoint + '/api/rethink/insert', {
            method: 'POST',
            body:JSON.stringify(data),
            headers: this.loadHeaders(),
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });
    }

}


export default transfertDataService;