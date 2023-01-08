const smartdom_endpoint = "https://api.smartdom.ch";
const token  = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzMwNTQ3MTUsInBhc3N3b3JkIjotNTUyMTU2MDc1ODI1OTgzNDU5NX0.w4AXTE7410-uiIzwUIvVcGKgjt5HAv4oeVYKTTPpRGc";
const usrtoken  = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzMxNDExMTUsImlkIjoiNDcyY2IyYTMtN2JjYi00ZmY5LTkwYjktNTM1ZmFhNzE1OGQ3IiwicGFzc3dvcmQiOjI0NTE1Nzk0ODUxMzUxNzMwOTV9.bE76y9RxlRJSf37EwXGbmUw4JIPbQdgSXWo2kbDlCoA";

let SmartdomService = {

    loadHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Accept", 'application/json');
        headers.append("token", token);
        headers.append("usrtoken", usrtoken);
        return headers;
    },


    details_facture_odoo(odoo_id,id){
        return fetch(smartdom_endpoint + '/odoo/'+odoo_id+'/bill/'+id+'/details', {
            method: 'GET',
            headers:this.loadHeaders()
        }).then(response => response.json()).catch(error => {
            //console.log(error);
            console.log("error get facture: " + id)
        });
    },
}


export default SmartdomService;