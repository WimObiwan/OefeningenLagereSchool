var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var models;
    (function (models) {
        'use strict';
        var Response = (function (_super) {
            __extends(Response, _super);
            function Response(answer, isSolution) {
                _super.call(this);
                this.answer = answer;
                this.isSolution = isSolution;
            }
            return Response;
        })(models.ModelBase);
        models.Response = Response;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=response.js.map