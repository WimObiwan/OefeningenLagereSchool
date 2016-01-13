var app;
(function (app) {
    var splittingNumbers;
    (function (splittingNumbers) {
        'use strict';
        var SplittingNumbersCtrl = (function () {
            function SplittingNumbersCtrl($scope, $timeout) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$scope.respond = function (answer) { return _this.respond(answer); };
                this.startExercise();
            }
            SplittingNumbersCtrl.prototype.startExercise = function () {
                this.$scope.currentExercise = new app.models.Exercise();
                this.$scope.currentChallenge = null;
                this.startChallenge();
            };
            SplittingNumbersCtrl.prototype.startChallenge = function () {
                var minNumber = 1;
                var maxNumber = 10;
                var numberToSplit = this.getRandomInt(minNumber, maxNumber);
                var splitComponent = this.getRandomInt(minNumber, numberToSplit);
                var solution = numberToSplit - splitComponent;
                var availableAnswers = [];
                availableAnswers.length = maxNumber + 1;
                for (var i = 0; i < availableAnswers.length; i++) {
                    availableAnswers[i] = i;
                }
                var challenge = new app.models.Challenge(numberToSplit, splitComponent, availableAnswers, solution);
                this.$scope.currentExercise.challenges.push(challenge);
                this.$scope.currentChallenge = challenge;
            };
            SplittingNumbersCtrl.prototype.respond = function (answer) {
                var challenge = this.$scope.currentChallenge;
                var isSolution = challenge.solution === answer;
                var response = new app.models.Response(answer, isSolution);
                this.$scope.currentChallenge.responses.push(response);
                this.startChallenge();
                //this.$timeout(() => this.startChallenge(), 2000);
            };
            SplittingNumbersCtrl.prototype.getRandomInt = function (minInclusive, maxInclusive) {
                return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
            };
            SplittingNumbersCtrl.$inject = ["$scope", "$timeout"];
            return SplittingNumbersCtrl;
        })();
        angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
    })(splittingNumbers = app.splittingNumbers || (app.splittingNumbers = {}));
})(app || (app = {}));
//# sourceMappingURL=splittingNumbersCtrl.js.map