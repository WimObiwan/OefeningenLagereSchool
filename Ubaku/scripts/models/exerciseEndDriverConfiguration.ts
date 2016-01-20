module app.models {
    "use strict";

    export class ExerciseEndDriverConfiguration {
        public static TypeInfinite: string = "infinite";
        public static TypeTime: string = "time";
        public static TypeChallengesCompleted: string = "challengesCompleted";
        public static TypeChallengesSolved: string = "challengesSolved";

        public type: string;
        public options: any;

        public constructor() {
            this.options = [];
        }
    }
}