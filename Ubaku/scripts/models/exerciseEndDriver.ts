module app.models {
    "use strict";

    export class ExerciseEndDriver {
        private type: ExerciseEndDriverType = null;
        private endAfterChallengesCompleted: number = null;
        private endAfterChallengesSolved: number = null;
        private endAfterSeconds: number = null;

        public constructor(private configuration: ExerciseEndDriverConfiguration) {
            this.type = this.configuration.type || Defaults.ExerciseEndDriverType;
            this.endAfterChallengesCompleted = this.configuration.options.endAfterChallengesCompleted || Defaults.ExerciseEndAfterChallengesCompleted;
            this.endAfterChallengesSolved = this.configuration.options.endAfterChallengesSolved || Defaults.ExerciseEndAfterChallengesSolved;
            this.endAfterSeconds = this.configuration.options.endAfterSeconds || Defaults.ExerciseEndAfterSeconds;
        }

        public shouldEnd(exercise: IExercise, status: ExerciseStatus): boolean { // TODO-L: Rename to isComplete?
            var totalSteps = this.getTotalSteps();
            var currentStep = this.getCurrentStep(status);
            return totalSteps !== null && totalSteps === currentStep;
        }

        public getTotalSteps(): number {
            if (this.type === ExerciseEndDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseEndDriverType.ChallengesCompleted) {
                return this.endAfterChallengesCompleted;
            } else if (this.type === ExerciseEndDriverType.ChallengesSolved) {
                return this.endAfterChallengesSolved;
            } else {
                throw new Error("Unknown exercise end driver type: " + this.type);
            }
        }

        public getCurrentStep(status: ExerciseStatus): number {
            if (this.type === ExerciseEndDriverType.Infinite) {
                return null;
            } else if (this.type === ExerciseEndDriverType.ChallengesCompleted) {
                return status.challengesCompletedCount;
            } else if (this.type === ExerciseEndDriverType.ChallengesSolved) {
                return status.challengesSolvedCount;
            } else {
                throw new Error("Unknown exercise end driver type: " + this.type);
            }
        }
    }
}