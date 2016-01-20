var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var models;
    (function (models) {
        "use strict";
        var Challenge = (function (_super) {
            __extends(Challenge, _super);
            function Challenge(numberToSplit, splitComponent, availableAnswers, solution) {
                _super.call(this);
                this.numberToSplit = numberToSplit;
                this.splitComponent = splitComponent;
                this.availableAnswers = availableAnswers;
                this.solution = solution;
                this.responses = [];
                this.isSolved = false;
            }
            Challenge.prototype.addResponse = function (answer) {
                if (this.isSolved) {
                    throw new Error("The challenge has already been solved.");
                }
                var response = new app.models.Response(answer, this.solution === answer);
                this.responses.push(response);
                this.isSolved = response.isSolution;
                var messageSeverity = response.isSolution ? app.models.Severity.Success : app.models.Severity.Error;
                return new models.ResponseStatus(response, this.getResponseMessage(response), messageSeverity);
            };
            Challenge.prototype.getLastResponse = function () {
                return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
            };
            Challenge.prototype.getLastAnswerOr = function (defaultValue) {
                var lastResponse = this.getLastResponse();
                return lastResponse === null ? defaultValue : lastResponse.answer.toString();
            };
            Challenge.prototype.getResponseMessage = function (response) {
                if (response.isSolution) {
                    return "Goed zo! " + this.numberToSplit + " kan je splitsen in " + this.splitComponent + " en " + response.answer + ".";
                }
                else {
                    return "Jammer! " + this.numberToSplit + " kan je niet splitsen in " + this.splitComponent + " en " + response.answer + ".";
                }
            };
            return Challenge;
        })(models.ModelBase);
        models.Challenge = Challenge;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=challenge.js.map