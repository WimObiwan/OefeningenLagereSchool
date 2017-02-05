/// <reference path="typings/references.d.ts" />

module app {
    "use strict";

    angular.module(app.models.Constants.App.AngularAppName, ["ngRoute"])
        // Filters
        .filter("percentage", ["$filter", function ($filter: ng.IFilterService) {
            // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
            return function (input: number, decimals: number) {
                return $filter("number")(input * 100, decimals) + "%";
            };
        }])
        .filter("bootstrap", ["$filter", function ($filter: ng.IFilterService) {
            return function (input: any, format: string) {
                if (format === "boolean") {
                    switch (<boolean>input) {
                        case true: return "success";
                        case false: return "danger";
                        default: return "default";
                    }
                } else if (format === "Severity") {
                    switch (<app.models.Severity>input) {
                        case app.models.Severity.Info: return "info";
                        case app.models.Severity.Success: return "success";
                        case app.models.Severity.Warning: return "warning";
                        case app.models.Severity.Error: return "danger";
                        default: return "default";
                    }
                } else if (format === "Status-Challenges") {
                    var status = <app.models.ExerciseStatus>input;
                    if (angular.isUndefined(status) || status === null || status.challengesRespondedCount === 0) {
                        return "info";
                    }
                    if (status.challengesSolvedPercentage < app.models.Constants.ScorePercentageThresholds.Error) {
                        return "danger";
                    }
                    if (status.challengesSolvedPercentage < app.models.Constants.ScorePercentageThresholds.Warning) {
                        return "warning";
                    }
                    return "success";
                } else {
                    return input;
                }
            };
        }])
        .filter("datetime", ["$filter", function ($filter: ng.IFilterService) {
            return function (input: string, format: string) {
                if (input === null) {
                    return "";
                }
                if (angular.isUndefined(format) || format === null || format === "") {
                    format = "yyyy-MM-dd HH:mm:ss";
                }
                return $filter("date")(new Date(input), format);
            };
        }])

        // Configuration
        .config(["$routeProvider", "$httpProvider", function ($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/eerste-leerjaar/rekenen", {
                    templateUrl: "scripts/controllers/arithmetic/index.html",
                    controller: app.models.Constants.ControllerNames.Arithmetic
                })
                .when("/derde-leerjaar/tafelbollen", {
                    templateUrl: "scripts/controllers/tafelbollen/index.html",
                    controller: app.models.Constants.ControllerNames.TafelBollen
                })
                .when("/", {
                    templateUrl: "home.html"
                })
                .otherwise({ redirectTo: "/" });
        }])

        // Initialization
        .run(["$rootScope", function ($rootScope: any) {
            // Make enums available on the root scope and therefore any child scope.
            $rootScope.Severity = app.models.Severity;
            $rootScope.ExerciseCompleteDriverType = app.models.ExerciseCompleteDriverType;
            $rootScope.ChallengeFactoryType = app.models.ChallengeFactoryType;
            $rootScope.ChallengeCompleteType = app.models.ChallengeCompleteType;
            $rootScope.SequenceType = app.models.SequenceType;
            $rootScope.ChallengeLayoutType = app.models.ChallengeLayoutType;
            $rootScope.ArithmeticChallengeUIComponentType = app.models.ArithmeticChallengeUIComponentType;
        }]);
}