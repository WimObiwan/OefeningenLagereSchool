module app.models {
    "use strict";

    export class ChallengeFactoryConfiguration {
        public static TypeSplittingNumbers: string = "splittingNumbers";

        public type: string;
        public options: any;

        public constructor() {
            this.options = [];
        }
    }
}