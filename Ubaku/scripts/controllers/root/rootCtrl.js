var app;
(function (app) {
    "use strict";
    var RootCtrl = (function () {
        //static $inject = [];
        function RootCtrl() {
        }
        return RootCtrl;
    })();
    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.Root, RootCtrl);
})(app || (app = {}));
//# sourceMappingURL=rootCtrl.js.map