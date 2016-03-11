module app.models {
    "use strict";

    export interface IChallenge extends IModelBase {
        availableAnswers: number[];
        solution: number;
        layout: ChallengeLayoutType;
        uiComponents: ChallengeUIComponent[];

        isSolved: boolean;
        isComplete: boolean;
        responses: IResponse[];

        equals(other: IChallenge): boolean;
        addResponse(answer: number): ResponseStatus;
        getResponseStatus(response: Response): ResponseStatus;
        getLastResponse(): IResponse;
    }

    export class Challenge extends ModelBase implements IChallenge {
        public responses: IResponse[] = [];
        public isSolved: boolean = false;
        public isComplete: boolean = false;

        constructor(public layout: ChallengeLayoutType, public uiComponents: ChallengeUIComponent[], public availableAnswers: number[], public solution: number, public correctResponseMessage: string, public incorrectResponseMessage: string) {
            super();
        }

        public equals(other: IChallenge) {
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
            var response = new Response(answer, this.solution === answer);
            this.responses.push(response);
            this.isSolved = response.isSolution;
            return this.getResponseStatus(response);
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
                return "Je hebt de vorige oefening overgeslagen.";
            } else if (response.isSolution) {
                return this.correctResponseMessage.replace(Constants.StringPlaceholders.Answer, response.answer.toString());
            } else {
                return this.incorrectResponseMessage.replace(Constants.StringPlaceholders.Answer, response.answer.toString());
            }
        }
    }
}