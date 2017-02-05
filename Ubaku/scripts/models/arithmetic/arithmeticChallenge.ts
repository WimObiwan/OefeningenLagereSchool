module app.models {
    "use strict";

    export class ArithmeticChallenge extends ModelBase implements IChallenge {
        public isSolved: boolean = false;
        public isComplete: boolean = false;
        public responseCount: number = 0;
        public layout: ChallengeLayoutType;
        public lastResponse: IResponse = null;

        constructor(public layout_: ChallengeLayoutType, public uiComponents: ChallengeUIComponent[], public availableAnswers: number[], public solution: number, public correctResponseMessage: string, public incorrectResponseMessage: string) {
            super();

            this.layout = layout_;
        }

        public equals(other: ArithmeticChallenge) {
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
        }

        public addResponse(answer: number): ResponseStatus {
            this.lastResponse = new Response(answer, this.solution === answer);
            this.responseCount++;
            this.isSolved = this.lastResponse.isSolution;
            return this.getResponseStatus(this.lastResponse);
        }

        public forceComplete(): void {
            this.isComplete = true;
            this.lastResponse = new Response(null, false);
        }

        public getResponseStatus(response: Response): ResponseStatus {
            var messageSeverity = response.isSolution ? Severity.Success : Severity.Error;
            return new ResponseStatus(response, this.getResponseMessage(response), messageSeverity);
        }

        public getLastResponse(): IResponse {
            return this.lastResponse;
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