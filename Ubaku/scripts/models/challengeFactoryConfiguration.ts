module app.models {
    "use strict";

    export class ChallengeFactoryConfiguration {
        public type: ChallengeFactoryType;
        public minNumber: number;
        public maxNumber: number;
        public primaryComponentSequence: app.models.SequenceType;
        public secondaryComponentSequence: app.models.SequenceType;
    }
}