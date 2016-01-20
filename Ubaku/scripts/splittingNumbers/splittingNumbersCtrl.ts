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

            configuration.exerciseEndDriver.type = app.models.ExerciseEndDriverConfiguration.TypeInfinite;
            configuration.exerciseEndDriver.options = {};

            configuration.challengeFactory.type = app.models.ChallengeFactoryConfiguration.TypeSplittingNumbers;
            configuration.challengeFactory.options = { minNumberToSplit: 0, maxNumberToSplit: 10, sequence: "random" };

            configuration.challengeEndDriver.type = app.models.ChallengeEndDriverConfiguration.TypeAnswered;

            this.$scope.exerciseDriver = new app.models.ExerciseDriver(configuration);
            this.$scope.exerciseDriver.start();
            this.$scope.respond = (answer) => this.$scope.exerciseDriver.respond(answer);
        }
    }

    angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
}