var app;
(function (app) {
    var models;
    (function (models) {
        'use strict';
        (function (ResponseStatus) {
            ResponseStatus[ResponseStatus["Skipped"] = 0] = "Skipped";
            ResponseStatus[ResponseStatus["Success"] = 1] = "Success";
            ResponseStatus[ResponseStatus["Failed"] = 2] = "Failed";
        })(models.ResponseStatus || (models.ResponseStatus = {}));
        var ResponseStatus = models.ResponseStatus;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=ResponseStatus.js.map