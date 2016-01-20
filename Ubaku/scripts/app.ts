/// <reference path="typings/references.d.ts" />

module app {
    "use strict";

    angular.module('app', ['ngRoute'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/", {
                    templateUrl: "scripts/splittingNumbers/index.html",
                    controller: "splittingNumbersCtrl"
                })
                .otherwise({ redirectTo: "/" });
        }])
        .run(['$rootScope', function ($rootScope: any) {
            // Make enums available on the root scope and therefore any child scope.
            $rootScope.Severity = app.models.Severity;
        }]);
}