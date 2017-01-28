module app.models {
    "use strict";

    export class ExerciseConfiguration {
        public exerciseCompleteDriver: ExerciseCompleteDriverConfiguration = new ExerciseCompleteDriverConfiguration();
        public arithmeticChallengeFactory: ArithmeticChallengeFactoryConfiguration;
        public tafelBollenChallengeFactory: TafelBollenChallengeFactoryConfiguration;
        public challengeDriver: ChallengeDriverConfiguration = new ChallengeDriverConfiguration();
    }
}