module app.models {
    "use strict";

    export class ExerciseConfiguration {
        public exerciseEndDriver: ExerciseEndDriverConfiguration = new ExerciseEndDriverConfiguration();
        public challengeFactory: ChallengeFactoryConfiguration = new ChallengeFactoryConfiguration();
        public challengeEndDriver: ChallengeEndDriverConfiguration = new ChallengeEndDriverConfiguration();
    }
}