module app.models {
    "use strict";

    declare var ga: any;

    export class ArithmeticChallenge extends ModelBase implements IChallenge {
        public isSolved: boolean = false;
        public isComplete: boolean = false;
        public responseCount: number = 0;
        public layout: ChallengeLayoutType;
        public lastResponse: IResponse = null;
        public numberStyle: string[] = [];

        constructor(public layout_: ChallengeLayoutType, public uiComponents: ChallengeUIComponent[], public availableAnswers: number[], public solution: number,
            public numberPatternBlack: number, public numberPatternGreen: number, public numberPatternRed: number,
            public correctResponseMessage: string, public incorrectResponseMessage: string) {
            super();

            this.layout = layout_;

            this.numberStyle = new Array<string>(10);
            for (var i: number = 0; i < 10; i++) {
                if (i < numberPatternBlack) {
                    this.numberStyle[i] = "black";
                } else if (i < numberPatternBlack + numberPatternGreen) {
                    this.numberStyle[i] = "lightgreen";
                } else if (i < numberPatternBlack + numberPatternGreen + numberPatternRed) {
                    this.numberStyle[i] = "red";
                } else {
                    this.numberStyle[i] = "white";
                }
            }
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

            if (ga) {
                ga('send', 'event', 'leerjaar-1', 'challenge', 'solved-' + (this.isSolved ? 'true' : 'false') + '-' + this.responseCount.toString());
            }

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