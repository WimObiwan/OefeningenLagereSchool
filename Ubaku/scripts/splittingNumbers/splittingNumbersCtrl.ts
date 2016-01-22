module app.splittingNumbers {
    "use strict";

    interface ISplittingNumbersScope extends ng.IScope {
        exerciseDriver: app.models.IExerciseDriver;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    class SplittingNumbersCtrl {
        public static $inject = ["$scope"];
        public constructor(private $scope: ISplittingNumbersScope) {
            var configuration = new app.models.ExerciseConfiguration();

            configuration.exerciseEndDriver.type = app.models.ExerciseEndDriverType.ChallengesCompleted;
            configuration.exerciseEndDriver.options = {
                endAfterChallengesCompleted: 10,
                endAfterChallengesSolved: 10,
                endAfterSeconds: 10
            };

            configuration.challengeFactory.type = app.models.ChallengeFactoryType.SplittingNumbers;
            configuration.challengeFactory.options = {
                minNumberToSplit: 0,
                maxNumberToSplit: 10,
                numberToSplitSequence: app.models.SequenceType.Up,
                splitComponentSequence: app.models.SequenceType.Random
            };

            configuration.challengeEndDriver.type = app.models.ChallengeEndDriverType.Solved;

            this.$scope.exerciseDriver = new app.models.ExerciseDriver(configuration);
            this.$scope.exerciseDriver.start();
            this.$scope.respondToCurrentChallenge = (answer) => this.$scope.exerciseDriver.respondToCurrentChallenge(answer);
            this.$scope.skipCurrentChallenge = () => this.$scope.exerciseDriver.skipCurrentChallenge();
        }
    }

    angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
}