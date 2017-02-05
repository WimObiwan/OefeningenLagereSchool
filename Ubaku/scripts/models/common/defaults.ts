module app.models {
    "use strict";

    export class Defaults {
        public static ExerciseCompleteDriverType = ExerciseCompleteDriverType.Infinite;
        public static ExerciseCompleteAfterChallengesCompleted = 10;
        public static ExerciseCompleteAfterChallengesSolved = 10;
        public static ExerciseCompleteAfterMinutes = 12;
        public static ChallengeFactoryType = ChallengeFactoryType.Random;
        public static ChallengeCompleteType = ChallengeCompleteType.Solved;
        public static ChallengeCompleteAfterSeconds = 10;
        public static PrimaryComponentSequenceType = SequenceType.Random;
        public static SecondaryComponentSequenceType = SequenceType.Random;
        public static MinNumber = 0;
        public static MaxNumber = 0;
    }
}