var app;
(function (app) {
    var models;
    (function (models) {
        "use strict";
        var ModelBase = (function () {
            function ModelBase() {
                this.createdTime = new Date();
            }
            return ModelBase;
        })();
        models.ModelBase = ModelBase;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=modelBase.js.map