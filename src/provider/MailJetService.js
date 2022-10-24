const endpoint = process.env.REACT_APP_API_BACK

let MailJetService = {

    sendMail(data){
        return fetch(endpoint+'/api/mailjet/sendByTemplate', {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });
    },

    sendMailByHtmlText(data){
        return fetch(endpoint+'/api/mailjet/sendByHtmlText', {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(error => {
            console.log(error);
        });
    }
};

export default MailJetService;
