module app.splittingNumbers {
    "use strict";

    interface ISplittingNumbersScope extends ng.IScope {
        exerciseDriver: app.models.IExerciseDriver;
        respond(answer: number): void;
    }

    class SplittingNumbersCtrl {
        public static $inject = ["$scope"];
        public constructor(private $scope: ISplittingNumbersScope) {
            var configuration = new app.models.ExerciseConfiguration();
            configuration.challengeEndDriver.type = app.models.ChallengeEndDriverConfiguration.TypeSolved;
            this.$scope.exerciseDriver = new app.models.ExerciseDriver(configuration);
            this.$scope.exerciseDriver.start();
            this.$scope.respond = (answer) => this.$scope.exerciseDriver.respond(answer);
        }
    }

    angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
}