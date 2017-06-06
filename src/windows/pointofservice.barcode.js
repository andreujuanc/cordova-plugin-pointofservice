var scanner = null;
var claimedScanner = null;
var options = null;
var events = [];

var barcode = {

    init: function (successCallback, errorCallback, opts) {
        options = opts;
        var handleError = function (error) {
            debugger;
            errorCallback(error);
        };
        setTimeout(function () {
            Windows.Devices.PointOfService.BarcodeScanner.getDefaultAsync()
                .then(claimScanner, handleError)
                .then(hookEvents, handleError)
                .then(enableScanner, handleError)
                .then(enableSymbologies, handleError)
                .then(
                    function (result) {
                        successCallback(result);
                    }, handleError
                );
        }, 1000);
    },
    addEventListener: function (successCallback, errorCallback, args) {
        var name = args[0];
        var handler = args[1];
        if (events.hasOwnProperty(name))
            events[name].push(handler);
        else
            events[name] = [handler];
        successCallback();
    }
};

var fireEvent = function(name, args) {
    if (!events.hasOwnProperty(name))
        return;

    //if (!args || !args.length)
    //    args = [];
    if (!Array.isArray(args))
        args = [args];

    var evs = events[name], l = evs.length;
    for (var i = 0; i < l; i++) {
        evs[i].apply(null, args);
    }
};

var claimScanner = function (found) {
    scanner = found;
    if (!scanner) return Promise.reject();
    return scanner.claimScannerAsync()
        .then(function (claimed) {
            claimedScanner = claimed;
            claimedScanner.isDecodeDataEnabled = true;
            return 
        })
};

var hookEvents = function () {
    //Windows.Devices.PointOfService.ClaimedBarcodeScanner().
    
    claimedScanner.addEventListener("datareceived", function (args) {
        var tempScanLabel = Windows.Storage.Streams.DataReader.fromBuffer(args.report.scanDataLabel).readString(args.report.scanDataLabel.length);
        var tempScanData = Windows.Storage.Streams.DataReader.fromBuffer(args.report.scanData).readString(args.report.scanData.length);
        var tempScanType = args.report.scanDataType;

        fireEvent('datareceived', 
            {
                reading: {
                    label: tempScanLabel,
                    data: tempScanData,
                    type: tempScanType
                },
                original: args
            }     
         );
        //WinJS.logAppend("Got data", "status");
    });

    return;
};

var enableScanner = function () {
    if (!claimedScanner) return Promise.reject();
    //setTimeout(function () {

        return claimedScanner.enableAsync()
            .then(
                function () {

                    if (!claimedScanner.isEnabled) return Promise.reject();
                    return;
                },
                function (error) {
                    debugger;
                    return Promise.reject();
                }
            );
   // }, 2000);
   
}

//http://stackoverflow.com/questions/37163351/does-javascript-implementation-of-claimedbarcodescanner-setactivesymbologiesasyn

var enableSymbologies = function () {   
    //Windows.Devices.PointOfService.BarcodeSymbologies.qr)
    //var syms = [Windows.Devices.PointOfService.BarcodeSymbologies.qr];
    var syms = [];
    
    for (var i = 0; i < options.symbologies.length; i++) {
        syms.push(Windows.Devices.PointOfService.BarcodeSymbologies[options.symbologies[i]]);
    }
    
    return POS.UWP.Barcode.setActiveSymbologiesAsync(claimedScanner, syms)
        .then(function (result) {
            
            //return scanner.getSupportedSymbologiesAsync()
            //    .then(function (currentSyms) {
                    
            //    });
            return true;
        });

}

cordova.commandProxy.add("barcode", barcode);
