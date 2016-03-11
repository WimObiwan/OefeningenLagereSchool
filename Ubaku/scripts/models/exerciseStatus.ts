module app.models {
    "use strict";

    export class ExerciseStatus {
        public isComplete: boolean = false;
        public exerciseCurrentStep: number = null;
        public exerciseTotalSteps: number = null;
        public exerciseCompletePercentage: number = null;

        public challengeNumber: number = null;
        public challengesRespondedCount: number = 0;
        public challengesCompletedCount: number = 0;
        public challengesSolvedCount: number = 0;
        public challengesSolvedPercentage: number = 0;
        public challengeTimeRemainingMilliseconds: number = null;
        public challengeTimeRemainingPercentage: number = null;
        public lastResponseStatus: ResponseStatus = null; // TODO-H: Move to challenge itself
    }
}