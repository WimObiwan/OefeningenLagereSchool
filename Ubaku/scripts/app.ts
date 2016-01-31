/// <reference path="typings/references.d.ts" />

module app {
    "use strict";

    angular.module("app", ["ngRoute"])
        // Filters
        .filter("percentage", ["$filter", function ($filter: ng.IFilterService) {
            // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
            return function (input: number, decimals: number) {
                return $filter("number")(input * 100, decimals) + "%";
            };
        }])

        // Configuration
        .config(["$routeProvider", "$httpProvider", function ($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/", {
                    templateUrl: "scripts/splittingNumbers/index.html",
                    controller: "splittingNumbersCtrl"
                })
                .otherwise({ redirectTo: "/" });
        }])

        // Initialization
        .run(["$rootScope", function ($rootScope: any) {
            // Make enums available on the root scope and therefore any child scope.
            $rootScope.Severity = app.models.Severity;
            $rootScope.ExerciseEndDriverType = app.models.ExerciseEndDriverType;
            $rootScope.ChallengeFactoryType = app.models.ChallengeFactoryType;
            $rootScope.ChallengeEndDriverType = app.models.ChallengeEndDriverType;
            $rootScope.SequenceType = app.models.SequenceType;
            $rootScope.ChallengeLayoutType = app.models.ChallengeLayoutType;
            $rootScope.ChallengeUIComponentType = app.models.ChallengeUIComponentType;
        }]);
}