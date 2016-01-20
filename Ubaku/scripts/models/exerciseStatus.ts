module app.models {
    "use strict";

    export class ExerciseStatus {
        public challengeNumber: number = null;
        public challengesCompletedCount: number = 0;
        public challengesSolvedCount: number = 0;
        public challengesSolvedPercentage: number = 0;
        public isComplete: boolean = false;
        public lastResponseStatus: ResponseStatus = null;
    }
}