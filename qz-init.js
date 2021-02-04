function launchQZ() {
    if (!qz.websocket.isActive()) {
        window.location.assign("qz:launch");
        //Retry 5 times, pausing 1 second between each attempt
        startConnection({ retries: 5, delay: 1 })
    }
}


function startConnection(config) {
    if (!qz.websocket.isActive()) {
        // updateState('Waiting', 'default');

        qz.websocket.connect(config).then(function () {
            // updateState('Active', 'success');
            findVersion();
        }).catch(handleConnectionError);
    } else {
        displayMessage('An active connection with QZ already exists.', 'alert-warning');
    }
}

function endConnection() {
    if (qz.websocket.isActive()) {
        qz.websocket.disconnect().then(function () {
            // updateState('Inactive', 'default');
        }).catch(handleConnectionError);
    } else {
        displayMessage('No active connection with QZ exists.', 'alert-warning');
    }
}

var qzVersion = 0;
function findVersion() {
    qz.api.getVersion().then(function (data) {
        // $("#qz-version").html(data);
        qzVersion = data;
        console.log(qzVersion)
    }).catch();
}
/// Helpers ///
function handleConnectionError(err) {
    updateState('Error', 'danger');

    if (err.target != undefined) {
        if (err.target.readyState >= 2) { //if CLOSING or CLOSED
            displayError("Connection to QZ Tray was closed");
        } else {
            displayError("A connection error occurred, check log for details");
            console.error(err);
        }
    } else {
        displayError(err);
    }
}
function displayError(err) {
    console.error(err);
    displayMessage(err, 'alert-danger');
}

function displayMessage(msg, css, time) {
    // if (css == undefined) { css = 'alert-info'; }

    // var timeout = setTimeout(function() { $('#' + timeout).alert('close'); }, time ? time : 5000);

    // var alert = $("<div/>").addClass('alert alert-dismissible fade in ' + css)
    //     .css('max-height', '20em').css('overflow', 'auto')
    //     .attr('id', timeout).attr('role', 'alert');
    // alert.html("<button type='button' class='close' data-dismiss='alert'>&times;</button>" + msg);

    // $("#qz-alert").append(alert);
    console.log(msg)
    // alert(msg)
}

function findDefaultPrinter(set) {
    qz.printers.getDefault().then(function (data) {
        displayMessage("<strong>Found:</strong> " + data);
        console.log(data)
        if (set) {
            setPrinter(data);
            // console.log(data)
        }
    }).catch(displayError);
}

function findPrinters() {
    qz.printers.find().then(function (data) {
        var list = '';
        for (var i = 0; i < data.length; i++) {
            list += "&nbsp; " + data[i] + "<br/>";
        }

        displayMessage("<strong>Available printers:</strong><br/>" + list, null, 15000);
    }).catch(displayError);
}