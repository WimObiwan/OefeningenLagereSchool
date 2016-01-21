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

        public shouldEnd(exercise: IExercise, status: ExerciseStatus): boolean {

            if (this.type === ExerciseEndDriverType.Infinite) {
                return false;
            }
            else if (this.type === ExerciseEndDriverType.ChallengesCompleted) {
                return status.challengesCompletedCount >= this.endAfterChallengesCompleted;
            }
            else if (this.type === ExerciseEndDriverType.ChallengesSolved) {
                return status.challengesSolvedCount >= this.endAfterChallengesSolved;
            }
            else {
                throw new Error("Unknown exercise end driver type: " + this.type);
            }
        }
    }
}