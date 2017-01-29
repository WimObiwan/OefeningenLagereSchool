module app.models {
    "use strict";

    export class TafelBollenChallenge extends ModelBase implements IChallenge {
        public responses: IResponse[] = [];
        public isSolved: boolean = false;
        public isComplete: boolean = false;

        constructor(public uiComponents: ChallengeUIComponent[], public availableAnswers: number[], public solution: number[], public correctResponseMessage: string, public incorrectResponseMessage: string) {
            super();
        }

        public equals(other: ArithmeticChallenge) {
            if (other === null) {
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
        }

        public addResponse(answer: number): ResponseStatus {
            var response = new Response(answer, false); // TODO!!!
            this.responses.push(response);
            this.isSolved = response.isSolution;
            return this.getResponseStatus(response);
        }

        public forceComplete(): void {
            if (this.responses.length === 0) {
                this.addResponse(null);
            }
            this.isComplete = true;
        }

        public getResponseStatus(response: Response): ResponseStatus {
            var messageSeverity = response.isSolution ? Severity.Success : Severity.Error;
            return new ResponseStatus(response, this.getResponseMessage(response), messageSeverity);
        }

        public getLastResponse() {
            return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
        }

        private getResponseMessage(response: IResponse): string {
            if (response.answer === null) {
                return "Je hebt geen antwoord gegeven.";
            } else if (response.isSolution) {
                return this.correctResponseMessage.replace(Constants.StringPlaceholders.Answer, response.answer.toString());
            } else {
                return this.incorrectResponseMessage.replace(Constants.StringPlaceholders.Answer, response.answer.toString());
            }
        }
    }
}