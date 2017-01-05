var PointOfService = {
    init: function (successCallback, errorCallback, options) {
        cordova.exec(successCallback, errorCallback, "barcode", "init", options);
    },
    addEventListener: function (name, listener) {
        cordova.exec(null, null, "barcode", "addEventListener", [name,  listener]);
    }
}

module.exports = PointOfService;