module app.models {
    "use strict";

    export interface IChallenge extends IModelBase {
        availableAnswers: number[];
        //solution: number;
        //layout: ChallengeLayoutType;
        uiComponents: ChallengeUIComponent[];

        isSolved: boolean;
        isComplete: boolean;
        responseCount: number;

        equals(other: IChallenge): boolean;
        addResponse(answer: number): ResponseStatus;
        forceComplete(): void;
        getResponseStatus(response: Response): ResponseStatus;
        getLastResponse(): IResponse;
    }
}
