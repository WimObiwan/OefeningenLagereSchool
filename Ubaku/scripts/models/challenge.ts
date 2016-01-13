module app.models {
    'use strict';

    export interface IChallenge extends IModelBase {
        numberToSplit: number;
        splitComponent: number;
        availableAnswers: number[];
        solution: number;

        responses: IResponse[];
        getLastResponse(): IResponse;
        getLastAnswerOr(defaultValue: string): string;
        getLastResponseMessage(): string;
    }

    export class Challenge extends ModelBase implements IChallenge {
        public responses: IResponse[];

        constructor(public numberToSplit: number, public splitComponent: number, public availableAnswers: number[], public solution: number) {
            super();
            this.responses = [];
        }

        getLastResponse() {
            return this.responses.length === 0 ? null : this.responses[this.responses.length - 1];
        }

        getLastAnswerOr(defaultValue: string): string {
            var lastResponse = this.getLastResponse();
            return lastResponse === null ? defaultValue : lastResponse.answer.toString();
        }

        getLastResponseMessage(): string {
            var lastResponse = this.getLastResponse();
            if (lastResponse === null) {
                return null;
            } else {
                if (lastResponse.isSolution) {
                    return "Goed zo! " + this.numberToSplit + " kan je splitsen in " + this.splitComponent + " en " + lastResponse.answer + ".";
                } else {
                    return "Jammer! " + this.numberToSplit + " kan je niet splitsen in " + this.splitComponent + " en " + lastResponse.answer + ".";
                }
            }
        }
    }
}