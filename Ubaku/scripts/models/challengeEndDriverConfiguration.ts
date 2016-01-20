module app.models {
    "use strict";

    export class ChallengeEndDriverConfiguration {
        public static TypeSolved: string = "solved";
        public static TypeAnswered: string = "answered";
        public static TypeManual: string = "manual";

        public type: string;
    }
}