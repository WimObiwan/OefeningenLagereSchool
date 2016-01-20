/// <reference path="typings/references.d.ts" />
var app;
(function (app) {
    "use strict";
    angular.module('app', ['ngRoute'])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/", {
                templateUrl: "scripts/splittingNumbers/index.html",
                controller: "splittingNumbersCtrl"
            })
                .otherwise({ redirectTo: "/" });
        }])
        .run(['$rootScope', function ($rootScope) {
            // Make enums available on the root scope and therefore any child scope.
            $rootScope.Severity = app.models.Severity;
        }]);
})(app || (app = {}));
//# sourceMappingURL=app.js.map