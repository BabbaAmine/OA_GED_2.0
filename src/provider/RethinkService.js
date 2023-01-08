const endpoint = "http://localhost:8080"

let RethinkService = {

    get_detail_ts(data){
        return fetch(endpoint+'/api/rethink/filter_table_data', {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(error => {
            //console.log(error);
        });
    }
};

export default RethinkService;
