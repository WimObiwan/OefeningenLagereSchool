module app.models {
    "use strict";

    export class ChallengeFactoryConfiguration {
        public static TypeSplittingNumbers: string = "splittingNumbers"; // TODO-M: Can use enums instead of string consts?
        public static TypeSplittingNumbersSequenceRandom: string = "random";
        public static TypeSplittingNumbersSequenceUp: string = "up";
        public static TypeSplittingNumbersSequenceDown: string = "down";

        public type: string;
        public options: any;

        public constructor() {
            this.options = [];
        }
    }
}