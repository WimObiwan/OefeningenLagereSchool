module app.models {
    "use strict";

    export class Defaults {
        public static ExerciseCompleteDriverType = ExerciseCompleteDriverType.Infinite;
        public static ExerciseCompleteAfterChallengesCompleted = 10;
        public static ExerciseCompleteAfterChallengesSolved = 10;
        public static ExerciseCompleteAfterSeconds = 60;
        public static ChallengeFactoryType = ChallengeFactoryType.SplitNumbers;
        public static ChallengeCompleteDriverType = ChallengeCompleteDriverType.Solved;
        public static PrimaryComponentSequenceType = SequenceType.Random;
        public static SecondaryComponentSequenceType = SequenceType.Random;
        public static MinNumber = 0;
        public static MaxNumber = 0;
    }
}