﻿module app.models {
    "use strict";

    export class ExerciseConfiguration {
        public exerciseCompleteDriver: ExerciseCompleteDriverConfiguration = new ExerciseCompleteDriverConfiguration();
        public challengeFactory: ChallengeFactoryConfiguration = new ChallengeFactoryConfiguration();
        public challengeCompleteDriver: ChallengeCompleteDriverConfiguration = new ChallengeCompleteDriverConfiguration();
    }
}