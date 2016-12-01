/// <reference path="typings/references.d.ts" />
var app;
(function (app) {
    "use strict";
    angular.module(app.models.Constants.App.AngularAppName, ["ngRoute"])
        .filter("percentage", ["$filter", function ($filter) {
            // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
            return function (input, decimals) {
                return $filter("number")(input * 100, decimals) + "%";
            };
        }])
        .filter("bootstrap", ["$filter", function ($filter) {
            return function (input, format) {
                if (format === "boolean") {
                    switch (input) {
                        case true: return "success";
                        case false: return "danger";
                        default: return "default";
                    }
                }
                else if (format === "Severity") {
                    switch (input) {
                        case app.models.Severity.Info: return "info";
                        case app.models.Severity.Success: return "success";
                        case app.models.Severity.Warning: return "warning";
                        case app.models.Severity.Error: return "danger";
                        default: return "default";
                    }
                }
                else if (format === "Status-Challenges") {
                    var status = input;
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
                }
                else {
                    return input;
                }
            };
        }])
        .filter("datetime", ["$filter", function ($filter) {
            return function (input, format) {
                if (input === null) {
                    return "";
                }
                if (angular.isUndefined(format) || format === null || format === "") {
                    format = "yyyy-MM-dd HH:mm:ss";
                }
                return $filter("date")(new Date(input), format);
            };
        }])
        .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
            // Configure the routes.
            $routeProvider
                .when("/", {
                templateUrl: "scripts/controllers/arithmetic/index.html",
                controller: app.models.Constants.ControllerNames.Arithmetic
            })
                .otherwise({ redirectTo: "/" });
        }])
        .run(["$rootScope", function ($rootScope) {
            // Make enums available on the root scope and therefore any child scope.
            $rootScope.Severity = app.models.Severity;
            $rootScope.ExerciseCompleteDriverType = app.models.ExerciseCompleteDriverType;
            $rootScope.ChallengeFactoryType = app.models.ChallengeFactoryType;
            $rootScope.ChallengeCompleteType = app.models.ChallengeCompleteType;
            $rootScope.ChallengeEndType = app.models.ChallengeEndType;
            $rootScope.SequenceType = app.models.SequenceType;
            $rootScope.ChallengeLayoutType = app.models.ChallengeLayoutType;
            $rootScope.ChallengeUIComponentType = app.models.ChallengeUIComponentType;
        }]);
})(app || (app = {}));
