var app;
(function (app) {
    var models;
    (function (models) {
        "use strict";
        var ResponseStatus = (function () {
            function ResponseStatus(response, message, messageSeverity) {
                this.response = response;
                this.message = message;
                this.messageSeverity = messageSeverity;
            }
            return ResponseStatus;
        })();
        models.ResponseStatus = ResponseStatus;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=responseStatus.js.map