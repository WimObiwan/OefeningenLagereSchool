/// <reference path="typings/references.d.ts" />
var app;
(function (app) {
    'use strict';
    angular.module('app', ['ngRoute'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/", {
                templateUrl: "scripts/splittingNumbers/index.html",
                controller: "splittingNumbersCtrl"
            })
                .otherwise({ redirectTo: "/" });
        }]);
})(app || (app = {}));
//# sourceMappingURL=app.js.map