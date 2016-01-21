module app.models {
    "use strict";

    export class Defaults {
        public static ExerciseEndDriverType = ExerciseEndDriverType.Infinite;
        public static ExerciseEndAfterChallengesCompleted = 10;
        public static ExerciseEndAfterChallengesSolved = 10;
        public static ExerciseEndAfterSeconds = 60;
        public static ChallengeFactoryType = ChallengeFactoryType.SplittingNumbers;
        public static ChallengeEndDriverType = ChallengeEndDriverType.Solved;
        public static NumberToSplitSequenceType = SequenceType.Random;
        public static SplitComponentSequenceType = SequenceType.Random;
        public static MinNumberToSplit = 0;
        public static MaxNumberToSplit = 0;
    }
}