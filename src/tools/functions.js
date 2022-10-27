const colors = ['#00AA55', '#e91e63', '#9c27b0', '#939393', '#E3BC00', '#D47500', '#DC2A2A', '#2196f3', '#00bcd4', '#ff9800', '#607d8b'];
const timeSuggestions = [
    "00h05", "00h10", "00h15", "00h30", "00h45", "01h00", "01h15", "01h30", "01h45", "02h00", "02h15", "02h30", "02h45", "03h00", "03h15", "03h30", "03h45", "04h00", "04h15", "04h30",
    "04h45", "05h00", "06h00", "07h00", "08h00", "09h00", "10h00"
]

const fr_numbers = [
    {
        str:"0",
        value:0
    },
    {
        str:"zéro",
        value:0
    },
    {
        str:"zero",
        value:0
    },
    {
        str:"1",
        value:1
    },
    {
        str:"un",
        value:1
    },
    {
        str:"une",
        value:1
    },
    {
        str:"2",
        value:2
    },
    {
        str:"deux",
        value:2
    },
    {
        str:"3",
        value:3
    },
    {
        str:"trois",
        value:3
    },
    {
        str:"troi",
        value:3
    },
    {
        str:"4",
        value:4
    },
    {
        str:"quatre",
        value:4
    },
    {
        str:"5",
        value:5
    },
    {
        str:"cinq",
        value:5
    },
    {
        str:"6",
        value:6
    },
    {
        str:"six",
        value:6
    },
    {
        str:"7",
        value:7
    },
    {
        str:"sept",
        value:7
    },
    {
        str:"8",
        value:8
    },
    {
        str:"huit",
        value:8
    },
    {
        str:"9",
        value:9
    },
    {
        str:"neuf",
        value:9
    },
    {
        str:"10",
        value:10
    },
    {
        str:"dix",
        value:10
    },
    {
        str:"11",
        value:11
    },
    {
        str:"onze",
        value:11
    },
    {
        str:"12",
        value:12
    },
    {
        str:"douze",
        value:12
    },
    {
        str:"13",
        value:13
    },
    {
        str:"treize",
        value:13
    },
    {
        str:"treze",
        value:13
    },
    {
        str:"14",
        value:14
    },
    {
        str:"quatorze",
        value:14
    },
    {
        str:"15",
        value:15
    },
    {
        str:"quinze",
        value:15
    },
    {
        str:"16",
        value:16
    },
    {
        str:"seize",
        value:16
    }
]

let utilFunctions = {

    verif_inpuText: function (text) {
        if (text !== undefined && text !== null) {
            return text === '' || text.trim() === '';
        }

    },

    verif_Number: function (phone) {
        return this.verif_inpuText(phone) || isNaN(phone) || parseInt(phone) < 0;
    },
    verif_Password: function (pwd) {
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let numbers = /[0-9]/g;
        return this.verif_inpuText(pwd) || !pwd.match(lowerCaseLetters) || !pwd.match(upperCaseLetters) || !pwd.match(numbers) || pwd.length < 6;
    },
    verif_match(pwd1, pwd2) {
        return ((pwd1 === '' && pwd2 === '') || (pwd1 !== pwd2));
    },
    verif_Email: function (email) {
        return this.verif_inpuText(email) || !(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,10})+$/.test(email));
    },

    getCharColor: function (text) {
        return colors[this.numberFromText(text) % colors.length]
    },

    verif_duration: function (duration) {
        let regexFormat = /^[0-9]{1,2}h[0-9]{0,2}$/
        return regexFormat.test(duration)
    },

    numberFromText: function (text) {
        let charCodes = text
            .split('') // => ["A", "A"]
            .map(char => char.charCodeAt(0)) // => [65, 65]
            .join(''); // => "6565"
        return parseInt(charCodes, 10);
    },

    buildTree: function (parts, treeNode, name, type, file) {
        if (parts.length === 0) {
            return;
        }
        for (var i = 0; i < treeNode.length; i++) {
            if (parts[0] === treeNode[i].text) {
                this.buildTree(parts.splice(1, parts.length), treeNode[i].children, name, type, file);
                return;
            }
        }
        var newNode = {'text': parts[0], 'children': []};
        if (parts[0].endsWith(".pdf")) {
            newNode.name = name;
            newNode.type = type;
            newNode.file = file;
        }
        treeNode.push(newNode);
        this.buildTree(parts.splice(1, parts.length), newNode.children, name, type, file);
    },

    getUID() {
        return Math.random().toString(36).substring(2, 15) + '-' +
            Math.random().toString(36).substring(2, 15) + '-' +
            Math.random().toString(36).substring(2, 15) + '-' +
            Math.random().toString(36).substring(2, 15);
    },

    formatDuration(duration) {
        let hour = duration.split(".")[0];
        let formatedHour = parseInt(hour) < 10 ? "0" + hour + "h" : hour + "h"
        let minutePercent = duration.split(".")[1] || "0";
        let nbMinutes = parseFloat("0." + minutePercent) * 60;
        return formatedHour.concat(parseInt(nbMinutes) < 10 ? "0" : "").concat(parseInt(nbMinutes.toString()));
    },

    durationToNumber(duration) {
        let hourValue = duration.split("h")[0]
        let minuteValue = duration.split("h")[1]
        let hourFormated = parseInt(hourValue) || 0
        let minuteFormated = parseInt(minuteValue) || 0
        return hourFormated + (minuteFormated / 60)
    },


    numberToWord(num) {
        if (num === 1) return "première"
        if (num === 2) return "deuxième"
        if (num === 3) return "troisième"
        if (num === 4) return "quatrième"
        if (num === 5) return "cinquième"
        if (num === 6) return "sixième"
        if (num === 7) return "septième"
        if (num === 8) return "huitième"
        if (num === 9) return "neuvième"
        if (num === 10) return "dixième"
    },

    numberToWord2(num) {
        if (num === 1) return "un"
        if (num === 2) return "deux"
        if (num === 3) return "trois"
        if (num === 4) return "quatre"
        if (num === 5) return "cinq"
        if (num === 6) return "six"
        if (num === 7) return "sept"
        if (num === 8) return "huit"
        if (num === 9) return "neuf"
        if (num === 10) return "dix"
    },

    convertBase64toBlob(content, contentType) {
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = window.atob(content); //method which converts base64 to binary
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        //statement which creates the blob
        return new Blob(byteArrays, {
            type: contentType
        });
    },


    base64PdftoBlob(data) {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const bytes = atob(data);
        let length = bytes.length;
        let out = new Uint8Array(length);
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
        return new Blob([out], {type: 'application/pdf'});
    },

    checkNumber(x) {
        if (typeof x == 'number' && !isNaN(x)) {
            if (Number.isInteger(x)) {
                return "integer"
            } else {
                return "float"
            }
        } else {
            return "NAN"
        }
    },

    toMMSS(secondes) {
        var sec_num = parseInt(secondes, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ':' + seconds;
    },

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    },

    imageUrltoBase64(url) {
        return new Promise( resolve => {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                let reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        })

    },

    compressImage(image, max_size, quality, max_width, max_height, resize) {
        return new Promise(resolve => {
            const Compress = require('compress.js');
            const compress = new Compress()
            compress.compress([image], {
                size: max_size, // the max size in MB, defaults to 2MB
                quality: quality, // the quality of the image, max is 1,
                maxWidth: max_width, // the max width of the output image, defaults to 1920px
                maxHeight: max_height, // the max height of the output image, defaults to 1920px
                resize: resize, // defaults to true, set false if you do not want to resize the image width and height
            }).then((data) => {
                resolve(data[0])
            }).catch((err) => {
                resolve("false")
            })
        })
    },

    // png images
    compressB64Image(b64, ext, max_size, quality, max_width, max_height, resize) {
        return new Promise(resolve => {
            const Compress = require('compress.js');
            const compress = new Compress()
            const file = Compress.convertBase64ToFile(b64.replace("data:image/png;base64,", ""), ext)
            compress.compress([file], {
                size: max_size, // the max size in MB, defaults to 2MB
                quality: quality, // the quality of the image, max is 1,
                maxWidth: max_width, // the max width of the output image, defaults to 1920px
                maxHeight: max_height, // the max height of the output image, defaults to 1920px
                resize: resize, // defaults to true, set false if you do not want to resize the image width and height
            }).then((data) => {
                resolve(data[0])
            }).catch((err) => {
                resolve("false")
            })
        })
    },



    transformObjects_format(object) {
        return Object.entries(object).map(([key, value], index) =>
            Object.assign({key: key}, value && typeof value.contains === 'object' && Object.keys(value.contains).length > 0
                ? {
                    value: key + ';' + this.getUID(),
                    label: key,
                    children: this.transformObjects_format3(value.contains),
                    showCheckbox: false
                }
                : {value: key + ';' + this.getUID(), label: key, icon: <i style={{marginLeft: -25}}/>}
            ));
    },

    getTimeSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : timeSuggestions.filter(x =>
            x.toLowerCase().slice(0, inputLength) === inputValue
        );
    },

    wordToNumber(text){
        let textArray = text.trim().split(/\s+/)
        if(textArray && textArray.length > 0){
            let number_str = textArray[0]
            let find_word = fr_numbers.find(x => x.str === number_str.trim().toLowerCase())
            if(find_word) return find_word.value
            else return false
        }else{
            return false
        }
    },

    countryToFlag(isoCode) {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode
                .toUpperCase()
                .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode;
    },
}


export default utilFunctions;
