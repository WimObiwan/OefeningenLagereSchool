module app.models {
    "use strict";

    export class Defaults {
        public static ExerciseCompleteDriverType = ExerciseCompleteDriverType.Infinite;
        public static ExerciseCompleteAfterChallengesCompleted = 10;
        public static ExerciseCompleteAfterChallengesSolved = 10;
        public static ExerciseCompleteAfterSeconds = 60;
        public static ChallengeFactoryType = ChallengeFactoryType.SplitNumbers;
        public static ChallengeCompleteType = ChallengeCompleteType.Solved;
        public static ChallengeCompleteTimeSeconds = 10;
        public static ChallengeEndType = ChallengeEndType.ChallengeComplete;
        public static PrimaryComponentSequenceType = SequenceType.Random;
        public static SecondaryComponentSequenceType = SequenceType.Random;
        public static MinNumber = 0;
        public static MaxNumber = 0;
    }
}