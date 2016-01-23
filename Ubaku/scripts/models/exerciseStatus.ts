module app.models {
    "use strict";

    export class ExerciseStatus {
        public isComplete: boolean = false; // TODO-L: Rename to exerciseIsComplete? Move exercise status and challenge status to separate class? Choose between "end" and "complete" consistently
        public exerciseCurrentStep: number = null;
        public exerciseTotalSteps: number = null;
        public exerciseCompletePercentage: number = null;

        public challengeNumber: number = null;
        public challengesAnsweredCount: number = 0;
        public challengesCompletedCount: number = 0;
        public challengesSolvedCount: number = 0;
        public challengesSolvedPercentage: number = 0;
        public lastResponseStatus: ResponseStatus = null; // TODO-L: Choose between "answer" and "response"
    }
}