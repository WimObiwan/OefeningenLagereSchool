module app.models {
    "use strict";

    export class ExerciseConfiguration {
        public exerciseCompleteDriver: ExerciseCompleteDriverConfiguration = new ExerciseCompleteDriverConfiguration();
        public arithmeticChallengeFactory: ArithmeticChallengeFactoryConfiguration = new ArithmeticChallengeFactoryConfiguration();
        public challengeDriver: ChallengeDriverConfiguration = new ChallengeDriverConfiguration();
    }
}