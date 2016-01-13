module app.splittingNumbers {
    'use strict';

    interface ISplittingNumbersScope extends ng.IScope {
        currentExercise: app.models.IExercise;
        currentChallenge: app.models.IChallenge;
        respond(answer: number): void;
    }

    class SplittingNumbersCtrl {
        static $inject = ["$scope", "$timeout"];
        constructor(private $scope: ISplittingNumbersScope, private $timeout : ng.ITimeoutService) {
            this.$scope.respond = (answer) => this.respond(answer);
            this.startExercise();
        }

        startExercise(): void {
            this.$scope.currentExercise = new app.models.Exercise();
            this.$scope.currentChallenge = null;
            this.startChallenge();
        }

        startChallenge(): void {
            var minNumber = 1;
            var maxNumber = 10;

            var numberToSplit = this.getRandomInt(minNumber, maxNumber);
            var splitComponent = this.getRandomInt(minNumber, numberToSplit);
            var solution = numberToSplit - splitComponent;
            var availableAnswers: number[] = [];
            availableAnswers.length = maxNumber + 1;
            for (var i = 0; i < availableAnswers.length; i++) {
                availableAnswers[i] = i;
            }

            var challenge = new app.models.Challenge(numberToSplit, splitComponent, availableAnswers, solution);
            this.$scope.currentExercise.challenges.push(challenge);
            this.$scope.currentChallenge = challenge;
        }

        respond(answer: number): void {
            var challenge = this.$scope.currentChallenge;
            var isSolution = challenge.solution === answer;
            var response = new app.models.Response(answer, isSolution);
            this.$scope.currentChallenge.responses.push(response);
            this.startChallenge();
            //this.$timeout(() => this.startChallenge(), 2000);
        }

        getRandomInt(minInclusive: number, maxInclusive: number): number {
            return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
        }
    }

    angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
}