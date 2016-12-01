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
            function Challenge(layout, uiComponents, availableAnswers, solution, correctResponseMessage, incorrectResponseMessage) {
                _super.call(this);
                this.layout = layout;
                this.uiComponents = uiComponents;
                this.availableAnswers = availableAnswers;
                this.solution = solution;
                this.correctResponseMessage = correctResponseMessage;
                this.incorrectResponseMessage = incorrectResponseMessage;
                this.responses = [];
                this.isSolved = false;
                this.isComplete = false;
            }
            Challenge.prototype.equals = function (other) {
                if (other === null) {
                    return false;
                }
                if (other.layout !== this.layout) {
                    return false;
                }
                if (other.uiComponents.length !== this.uiComponents.length) {
                    return false;
                }
                for (var i = 0; i < other.uiComponents.length; i++) {
                    if (!other.uiComponents[i].equals(this.uiComponents[i])) {
                        return false;
                    }
                }
                return true;
            };
            Challenge.prototype.addResponse = function (answer) {
                var response = new models.Response(answer, this.solution === answer);
                this.responses.push(response);
                this.isSolved = response.isSolution;
                return this.getResponseStatus(response);
            };
            Challenge.prototype.forceComplete = function () {
                if (this.responses.length === 0) {
                    this.addResponse(null);
                }
                this.isComplete = true;
            };
            Challenge.prototype.getResponseStatus = function (response) {
                var messageSeverity = response.isSolution ? models.Severity.Success : models.Severity.Error;
                return new models.ResponseStatus(response, this.getResponseMessage(response), messageSeverity);
            };
            Challenge.prototype.getLastResponse = function () {
                return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
            };
            Challenge.prototype.getResponseMessage = function (response) {
                if (response.answer === null) {
                    return "Je hebt geen antwoord gegeven.";
                }
                else if (response.isSolution) {
                    return this.correctResponseMessage.replace(models.Constants.StringPlaceholders.Answer, response.answer.toString());
                }
                else {
                    return this.incorrectResponseMessage.replace(models.Constants.StringPlaceholders.Answer, response.answer.toString());
                }
            };
            return Challenge;
        }(models.ModelBase));
        models.Challenge = Challenge;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
