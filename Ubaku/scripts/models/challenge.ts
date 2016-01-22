module app.models {
    "use strict";

    export interface IChallenge extends IModelBase {
        numberToSplit: number;
        splitComponent: number;
        availableAnswers: number[];
        solution: number;

        isSolved: boolean;
        responses: IResponse[];

        equals(other: IChallenge): boolean;
        addResponse(answer: number): ResponseStatus;
        getLastResponse(): IResponse;
        getLastAnswerOr(defaultValue: string): string;
    }

    export class Challenge extends ModelBase implements IChallenge {
        public responses: IResponse[] = [];
        public isSolved: boolean = false;

        constructor(public numberToSplit: number, public splitComponent: number, public availableAnswers: number[], public solution: number) {
            super();
        }

        public equals(other: IChallenge) {
            if (other === null) {
                return false;
            }
            if (other.numberToSplit === this.numberToSplit && other.splitComponent === this.splitComponent) {
                return true;
            }
            return false;
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

        public getLastAnswerOr(defaultValue: string): string {
            var lastResponse = this.getLastResponse();
            return lastResponse === null ? defaultValue : lastResponse.answer.toString();
        }

        private getResponseMessage(response: IResponse): string {
            if (response.answer === null) {
                return "Je hebt de vorige oefening overgeslagen.";
            } else if (response.isSolution) {
                return "Goed zo! " + this.numberToSplit + " kan je splitsen in " + this.splitComponent + " en " + response.answer + ".";
            } else {
                return "Jammer! " + this.numberToSplit + " kan je niet splitsen in " + this.splitComponent + " en " + response.answer + ".";
            }
        }
    }
}