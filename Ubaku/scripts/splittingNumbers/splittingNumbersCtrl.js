var app;
(function (app) {
    var splittingNumbers;
    (function (splittingNumbers) {
        "use strict";
        var SplittingNumbersCtrl = (function () {
            function SplittingNumbersCtrl($scope) {
                var _this = this;
                this.$scope = $scope;
                var configuration = new app.models.ExerciseConfiguration();
                configuration.challengeEndDriver.type = app.models.ChallengeEndDriverConfiguration.TypeSolved;
                this.$scope.exerciseDriver = new app.models.ExerciseDriver(configuration);
                this.$scope.exerciseDriver.start();
                this.$scope.respond = function (answer) { return _this.$scope.exerciseDriver.respond(answer); };
            }
            SplittingNumbersCtrl.$inject = ["$scope"];
            return SplittingNumbersCtrl;
        })();
        angular.module("app").controller("splittingNumbersCtrl", SplittingNumbersCtrl);
    })(splittingNumbers = app.splittingNumbers || (app.splittingNumbers = {}));
})(app || (app = {}));
//# sourceMappingURL=splittingNumbersCtrl.js.map