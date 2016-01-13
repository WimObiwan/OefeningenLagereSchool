var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var models;
    (function (models) {
        'use strict';
        var Challenge = (function (_super) {
            __extends(Challenge, _super);
            function Challenge(numberToSplit, splitComponent, availableAnswers, solution) {
                _super.call(this);
                this.numberToSplit = numberToSplit;
                this.splitComponent = splitComponent;
                this.availableAnswers = availableAnswers;
                this.solution = solution;
                this.responses = [];
            }
            Challenge.prototype.getLastResponse = function () {
                return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
            };
            Challenge.prototype.getLastAnswerOr = function (defaultValue) {
                var lastResponse = this.getLastResponse();
                return lastResponse === null ? defaultValue : lastResponse.answer.toString();
            };
            Challenge.prototype.getLastResponseMessage = function () {
                var lastResponse = this.getLastResponse();
                if (lastResponse === null) {
                    return null;
                }
                else {
                    if (lastResponse.isSolution) {
                        return "Goed zo! " + this.numberToSplit + " kan je splitsen in " + this.splitComponent + " en " + lastResponse.answer + ".";
                    }
                    else {
                        return "Jammer! " + this.numberToSplit + " kan je niet splitsen in " + this.splitComponent + " en " + lastResponse.answer + ".";
                    }
                }
            };
            return Challenge;
        })(models.ModelBase);
        models.Challenge = Challenge;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=challenge.js.map