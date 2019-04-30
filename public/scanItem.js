DWTQR("scanItem");

dwStartScan();

var dataItem = {
    stringItemQR: null
}

var urlItem = "https://share-it-backend-dev.herokuapp.com/iotcheckitemqr";

var scanItemTitle = document.getElementById("lender-name");
scanItemTitle.innerHTML = localStorage.getItem("lenderName") + ": Scan Your Item";

function dwQRReader(data) {
    dataItem.stringItemQR = data;
    console.log(data);
    // document.getElementById("mycanvas").style.display = 'none';
    sendItem();
}

function sendItem() {
    fetch(urlItem, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(dataItem), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => {
            if (response.res == "false") {
                dwStartScan();
            } else {
                // console.log(response[0].item_name);
                // itemName = response[0].item_name;
                localStorage.setItem("itemName", response[0].item_name);
                // console.log(localStorage.getItem("lenderName"));
                window.location.href = "scanBorrower.html";

            }
        }).catch(error => {
            dwStartScan();
        });
}