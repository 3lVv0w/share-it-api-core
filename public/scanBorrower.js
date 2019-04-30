DWTQR("scanBorrower");

dwStartScan();

var dataBorrower = {
    stringBorrowerQR: null
}

var urlBorrower = "https://share-it-backend-dev.herokuapp.com/iotcheckborrowerqr";

function dwQRReader(data) {
    dataBorrower.stringBorrowerQR = data;
    // document.getElementById("mycanvas").style.display = 'none';
    sendBorrower();
}

function sendBorrower() {
    fetch(urlBorrower, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(dataBorrower), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            if (response.res == "false") {
                dwStartScan();
            } else {
                console.log(response[0].first_name)
                localStorage.setItem("borrowerName", response[0].first_name);
                window.location.href = "validate.html";

            }
        })
        .catch(error =>{
            dwStartScan();
        });
}