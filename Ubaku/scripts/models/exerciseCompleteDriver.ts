module app.models {
    "use strict";

    export class ExerciseCompleteDriver {
        private type: ExerciseCompleteDriverType = null;
        private completeAfterChallengesCompleted: number = null;
        private completeAfterChallengesSolved: number = null;
        private completeAfterSeconds: number = null;

        public constructor(private exerciseDriver: ExerciseDriver, configuration: ExerciseCompleteDriverConfiguration) {
            // Determine the configuration parameters.
            this.type = configuration.type || Defaults.ExerciseCompleteDriverType;
            this.completeAfterChallengesCompleted = configuration.completeAfterChallengesCompleted || Defaults.ExerciseCompleteAfterChallengesCompleted;
            this.completeAfterChallengesSolved = configuration.completeAfterChallengesSolved || Defaults.ExerciseCompleteAfterChallengesSolved;
            this.completeAfterSeconds = configuration.completeAfterSeconds || Defaults.ExerciseCompleteAfterSeconds;
        }

        public isComplete(): boolean {
            var totalSteps = this.getTotalSteps();
            var currentStep = this.getCurrentStep();
            return totalSteps !== null && totalSteps === currentStep;
        }

        public getTotalSteps(): number {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesCompleted) {
                return this.completeAfterChallengesCompleted;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesSolved) {
                return this.completeAfterChallengesSolved;
            } else {
                throw new Error("Unknown exercise complete driver type: " + this.type);
            }
        }

        public getCurrentStep(): number {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesCompleted) {
                return this.exerciseDriver.getChallengesCompletedCount();
            } else if (this.type === ExerciseCompleteDriverType.ChallengesSolved) {
                return this.exerciseDriver.getChallengesSolvedCount();
            } else {
                throw new Error("Unknown exercise complete driver type: " + this.type);
            }
        }
    }
}