module app.splittingNumbers {
    "use strict";

    interface ISplittingNumbersScope extends ng.IScope {
        configuration: app.models.ExerciseConfiguration;
        exerciseDriver: app.models.IExerciseDriver;
        startExercise(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    class SplittingNumbersCtrl {
        public static $inject = ["$scope"];
        public constructor(private $scope: ISplittingNumbersScope) {
            this.$scope.configuration = this.getDefaultConfiguration();
            this.$scope.respondToCurrentChallenge = (answer) => this.$scope.exerciseDriver.respondToCurrentChallenge(answer);
            this.$scope.skipCurrentChallenge = () => this.$scope.exerciseDriver.skipCurrentChallenge();
            this.$scope.startExercise = () => this.startExercise();
            this.startExercise();
        }

        public startExercise(): void {
            this.$scope.exerciseDriver = new app.models.ExerciseDriver(this.$scope.configuration);
            this.$scope.exerciseDriver.start();
        }

        private getDefaultConfiguration(): app.models.ExerciseConfiguration {
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
                numberToSplitSequence: app.models.SequenceType.Random,
                splitComponentSequence: app.models.SequenceType.Up
            };

            configuration.challengeEndDriver.type = app.models.ChallengeEndDriverType.Answered;

            return configuration;
        }
    }

    angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
}