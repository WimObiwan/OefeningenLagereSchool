module app.models {
    "use strict";

    export class ExerciseEndDriver {
        private type: string = null;
        private endAfterChallengesCompleted: number = null;
        private endAfterChallengesSolved: number = null;
        private endAfterSeconds: number = null;

        public constructor(private configuration: ExerciseEndDriverConfiguration) {
            this.type = this.configuration.type || ExerciseEndDriverConfiguration.TypeInfinite;
            this.endAfterChallengesCompleted = this.configuration.options.endAfterChallengesCompleted || 10;
            this.endAfterChallengesSolved = this.configuration.options.endAfterChallengesSolved || 10;
            this.endAfterSeconds = this.configuration.options.endAfterSeconds || 60;
        }

        public shouldEnd(exercise: IExercise, status: ExerciseStatus): boolean {

            if (this.type === ExerciseEndDriverConfiguration.TypeInfinite) {
                return false;
            }
            else if (this.type === ExerciseEndDriverConfiguration.TypeChallengesCompleted) {
                return status.challengesCompletedCount >= this.endAfterChallengesCompleted;
            }
            else if (this.type === ExerciseEndDriverConfiguration.TypeChallengesSolved) {
                return status.challengesSolvedCount >= this.endAfterChallengesSolved;
            }
            //else if (exerciseEndDriverType === ExerciseEndDriverConfiguration.TypeTime) {
                // TODO-M: Implement time-based exercise end driver
            //}
            else {
                throw new Error("Unknown exercise end driver type: " + this.type);
            }
        }
    }
}