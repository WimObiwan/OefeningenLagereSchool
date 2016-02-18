module app {
    "use strict";

    interface IRootCtrl {
    }

    class RootCtrl implements IRootCtrl {

        //static $inject = [];
        constructor() {
        }
    }

    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.Root, RootCtrl);
}