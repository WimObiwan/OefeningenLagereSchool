module app.models {
    "use strict";

    export class ArithmeticChallengeFactoryConfiguration {
        public type: ChallengeFactoryType;
        public minNumber: number;
        public maxNumber: number;
        public primaryComponentSequence: app.models.SequenceType;
        public secondaryComponentSequence: app.models.SequenceType;
        public showNumberPatternType: app.models.ShowNumberPatternType;
    }
}