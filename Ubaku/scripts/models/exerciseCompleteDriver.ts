module app.models {
    "use strict";

    export class ExerciseCompleteDriver {
        private type: ExerciseCompleteDriverType = null;
        private completeAfterChallengesCompleted: number = null;
        private completeAfterChallengesSolved: number = null;
        private completeAfterSeconds: number = null;

        public constructor(private configuration: ExerciseCompleteDriverConfiguration) {
            // Determine the configuration parameters.
            this.type = this.configuration.type || Defaults.ExerciseCompleteDriverType;
            this.completeAfterChallengesCompleted = this.configuration.completeAfterChallengesCompleted || Defaults.ExerciseCompleteAfterChallengesCompleted;
            this.completeAfterChallengesSolved = this.configuration.completeAfterChallengesSolved || Defaults.ExerciseCompleteAfterChallengesSolved;
            this.completeAfterSeconds = this.configuration.completeAfterSeconds || Defaults.ExerciseCompleteAfterSeconds;
        }

        public isComplete(exercise: IExercise, status: ExerciseStatus): boolean {
            var totalSteps = this.getTotalSteps();
            var currentStep = this.getCurrentStep(status);
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

        public getCurrentStep(status: ExerciseStatus): number {
            if (this.type === ExerciseCompleteDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesCompleted) {
                return status.challengesCompletedCount;
            } else if (this.type === ExerciseCompleteDriverType.ChallengesSolved) {
                return status.challengesSolvedCount;
            } else {
                throw new Error("Unknown exercise complete driver type: " + this.type);
            }
        }
    }
}