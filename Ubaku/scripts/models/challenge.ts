module app.models {
    "use strict";

    export interface IChallenge extends IModelBase {
        availableAnswers: number[];
        solution: number;
        layout: ChallengeLayoutType;
        uiComponents: ChallengeUIComponent[];

        isSolved: boolean;
        responses: IResponse[];

        equals(other: IChallenge): boolean;
        addResponse(answer: number): ResponseStatus;
        getLastResponse(): IResponse;
    }

    export class Challenge extends ModelBase implements IChallenge {
        public responses: IResponse[] = [];
        public isSolved: boolean = false;

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
            if (this.isSolved) {
                throw new Error("The challenge has already been solved.");
            }
            var response = new app.models.Response(answer, this.solution === answer);
            this.responses.push(response);
            this.isSolved = response.isSolution;
            var messageSeverity = response.isSolution ? app.models.Severity.Success : app.models.Severity.Error;
            return new ResponseStatus(response, this.getResponseMessage(response), messageSeverity);
        }

        public getLastResponse() {
            return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
        }

        private getResponseMessage(response: IResponse): string {
            if (response.answer === null) {
                return "Je hebt de vorige oefening overgeslagen.";
            } else if (response.isSolution) {
                return this.correctResponseMessage.replace("{answer}", response.answer.toString());
            } else {
                return this.incorrectResponseMessage.replace("{answer}", response.answer.toString());
            }
        }
    }
}