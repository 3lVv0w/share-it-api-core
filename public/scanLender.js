DWTQR("mycanvas");

dwStartScan();

var dataLender = {
    stringLenderQR: null
}

var urlLender = "https://share-it-backend-dev.herokuapp.com/iotchecklenderqr";

function dwQRReader(data) {
    console.log(data);
    dataLender.stringLenderQR = data;
    // document.getElementById("mycanvas").style.display = 'none';
    sendLender();
}

function sendLender() {
    fetch(urlLender, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(dataLender), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            if (response.res == "false") {
                dwStartScan();
            } else {
                console.log(response[0].first_name);
                localStorage.setItem("lenderName", response[0].first_name);
                window.location.href = "scanItem.html";
                // console.log("The lender's name is " + response[0].first_name);
                // lenderName = response[0].first_name;
            }
        }).catch(
            error => {
                dwStartScan();
            }
        );
}