var app;
(function (app) {
    "use strict";
    var RootCtrl = (function () {
        function RootCtrl() {
        }
        return RootCtrl;
    }());
    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.Root, RootCtrl);
})(app || (app = {}));
