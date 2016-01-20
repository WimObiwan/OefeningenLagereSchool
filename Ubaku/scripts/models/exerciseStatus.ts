module app.models {
    "use strict";

    export class ExerciseStatus {
        public challengeNumber: number = null;
        public challengeCount: number = null;
        public isComplete: boolean = false;
        public lastResponseStatus: ResponseStatus = null;
    }
}