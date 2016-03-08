module app.models {
    "use strict";

    export class ExerciseCompleteDriverConfiguration {
        public type: ExerciseCompleteDriverType;
        public completeAfterChallengesCompleted: number;
        public completeAfterChallengesSolved: number;
        public completeAfterSeconds: number;
    }
}